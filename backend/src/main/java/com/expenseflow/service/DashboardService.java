package com.expenseflow.service;

import com.expenseflow.dto.DashboardSummaryDTO;
import com.expenseflow.dto.TransactionDTO;
import com.expenseflow.entity.Budget;
import com.expenseflow.entity.Expense;
import com.expenseflow.entity.Income;
import com.expenseflow.entity.User;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.BudgetRepository;
import com.expenseflow.repository.ExpenseRepository;
import com.expenseflow.repository.IncomeRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public DashboardSummaryDTO getDashboardSummary() {
        User user = getCurrentUser();

        // 1. Total Income & Total Expenses
        BigDecimal totalIncome = incomeRepository.sumTotalByUser(user);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpenses = expenseRepository.sumTotalByUser(user);
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal currentBalance = totalIncome.subtract(totalExpenses);

        // 2. Current Month Spending & Budgets
        LocalDate now = LocalDate.now();
        YearMonth currentYearMonth = YearMonth.now();
        LocalDate startOfMonth = currentYearMonth.atDay(1);
        LocalDate endOfMonth = currentYearMonth.atEndOfMonth();

        BigDecimal currentMonthSpending = expenseRepository.sumByUserAndDateBetween(user, startOfMonth, endOfMonth);
        if (currentMonthSpending == null) currentMonthSpending = BigDecimal.ZERO;

        List<Budget> currentMonthBudgets = budgetRepository.findByUserAndMonthAndYear(user, now.getMonthValue(), now.getYear());
        BigDecimal currentMonthBudgetTotal = currentMonthBudgets.stream()
                .map(Budget::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal currentMonthBudgetRemaining = currentMonthBudgetTotal.subtract(currentMonthSpending);

        // 3. Recent Transactions (Top 10 combined)
        List<Expense> expenses = expenseRepository.findByUserOrderByDateDescCreatedAtDesc(user);
        List<Income> incomes = incomeRepository.findByUserOrderByDateDescCreatedAtDesc(user);

        List<TransactionDTO> transactions = new ArrayList<>();
        for (Expense e : expenses) {
            String catName = e.getCategory() != null ? e.getCategory().getName() : "Uncategorized";
            transactions.add(new TransactionDTO(
                    e.getId(),
                    "EXPENSE",
                    e.getAmount(),
                    e.getDescription(),
                    catName,
                    e.getPaymentMethod(),
                    e.getDate(),
                    e.getCreatedAt()
            ));
        }

        for (Income i : incomes) {
            transactions.add(new TransactionDTO(
                    i.getId(),
                    "INCOME",
                    i.getAmount(),
                    i.getDescription(),
                    i.getSource(),
                    i.getSource(),
                    i.getDate(),
                    i.getCreatedAt()
            ));
        }

        // Sort descending by date, then createdAt
        transactions.sort((t1, t2) -> {
            int dateCompare = t2.getDate().compareTo(t1.getDate());
            if (dateCompare != 0) return dateCompare;
            if (t2.getCreatedAt() != null && t1.getCreatedAt() != null) {
                return t2.getCreatedAt().compareTo(t1.getCreatedAt());
            }
            return 0;
        });

        List<TransactionDTO> recentTransactions = transactions.stream()
                .limit(10)
                .collect(Collectors.toList());

        // 4. Expense by Category Breakdown
        Map<String, BigDecimal> categoryExpenses = new HashMap<>();
        for (Expense e : expenses) {
            String catName = e.getCategory() != null ? e.getCategory().getName() : "Other";
            categoryExpenses.put(catName, categoryExpenses.getOrDefault(catName, BigDecimal.ZERO).add(e.getAmount()));
        }

        // 5. Monthly Income vs Expense (Past 6 Months)
        List<DashboardSummaryDTO.MonthlyData> monthlyComparison = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {
            YearMonth ym = currentYearMonth.minusMonths(i);
            LocalDate start = ym.atDay(1);
            LocalDate end = ym.atEndOfMonth();

            BigDecimal mIncome = incomeRepository.sumByUserAndDateBetween(user, start, end);
            if (mIncome == null) mIncome = BigDecimal.ZERO;

            BigDecimal mExpense = expenseRepository.sumByUserAndDateBetween(user, start, end);
            if (mExpense == null) mExpense = BigDecimal.ZERO;

            monthlyComparison.add(new DashboardSummaryDTO.MonthlyData(
                    ym.format(formatter),
                    mIncome,
                    mExpense
            ));
        }

        DashboardSummaryDTO summary = new DashboardSummaryDTO();
        summary.setTotalIncome(totalIncome);
        summary.setTotalExpenses(totalExpenses);
        summary.setCurrentBalance(currentBalance);
        summary.setCurrentMonthSpending(currentMonthSpending);
        summary.setCurrentMonthBudgetTotal(currentMonthBudgetTotal);
        summary.setCurrentMonthBudgetRemaining(currentMonthBudgetRemaining);
        summary.setRecentTransactions(recentTransactions);
        summary.setCategoryExpenses(categoryExpenses);
        summary.setMonthlyComparison(monthlyComparison);

        return summary;
    }
}
