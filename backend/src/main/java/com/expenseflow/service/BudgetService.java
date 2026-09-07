package com.expenseflow.service;

import com.expenseflow.dto.BudgetDTO;
import com.expenseflow.dto.BudgetSummaryDTO;
import com.expenseflow.entity.Budget;
import com.expenseflow.entity.Category;
import com.expenseflow.entity.User;
import com.expenseflow.exception.BadRequestException;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.BudgetRepository;
import com.expenseflow.repository.CategoryRepository;
import com.expenseflow.repository.ExpenseRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public BudgetSummaryDTO convertToSummaryDTO(Budget budget) {
        User user = budget.getUser();
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal spent = expenseRepository.sumByUserAndCategoryAndDateBetween(user, budget.getCategory(), startDate, endDate);
        if (spent == null) {
            spent = BigDecimal.ZERO;
        }

        BigDecimal budgetAmount = budget.getAmount();
        BigDecimal remaining = budgetAmount.subtract(spent);

        double percentage = 0.0;
        if (budgetAmount.compareTo(BigDecimal.ZERO) > 0) {
            percentage = spent.divide(budgetAmount, 4, RoundingMode.HALF_UP).doubleValue() * 100.0;
            percentage = Math.round(percentage * 100.0) / 100.0;
        }

        return new BudgetSummaryDTO(
                budget.getId(),
                budgetAmount,
                spent,
                remaining,
                percentage,
                budget.getMonth(),
                budget.getYear(),
                budget.getCategory().getId(),
                budget.getCategory().getName()
        );
    }

    private BudgetDTO convertToDTO(Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setAmount(budget.getAmount());
        dto.setMonth(budget.getMonth());
        dto.setYear(budget.getYear());
        dto.setCategoryId(budget.getCategory().getId());
        dto.setCategoryName(budget.getCategory().getName());
        return dto;
    }

    public List<BudgetSummaryDTO> getAllBudgetsForCurrentUser(Integer month, Integer year) {
        User user = getCurrentUser();
        List<Budget> budgets;
        if (month != null && year != null) {
            budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        } else {
            budgets = budgetRepository.findByUser(user);
        }
        return budgets.stream().map(this::convertToSummaryDTO).collect(Collectors.toList());
    }

    public BudgetSummaryDTO getBudgetById(Long id) {
        User user = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));
        return convertToSummaryDTO(budget);
    }

    @Transactional
    public BudgetSummaryDTO createBudget(BudgetDTO dto) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(dto.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        if (budgetRepository.existsByUserAndCategoryAndMonthAndYear(user, category, dto.getMonth(), dto.getYear())) {
            throw new BadRequestException("A budget for category '" + category.getName() + "' already exists for " + dto.getMonth() + "/" + dto.getYear());
        }

        Budget budget = new Budget(
                dto.getAmount(),
                dto.getMonth(),
                dto.getYear(),
                category,
                user
        );

        Budget saved = budgetRepository.save(budget);
        return convertToSummaryDTO(saved);
    }

    @Transactional
    public BudgetSummaryDTO updateBudget(Long id, BudgetDTO dto) {
        User user = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        Category category = categoryRepository.findByIdAndUser(dto.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        budget.setAmount(dto.getAmount());
        budget.setMonth(dto.getMonth());
        budget.setYear(dto.getYear());
        budget.setCategory(category);

        Budget saved = budgetRepository.save(budget);
        return convertToSummaryDTO(saved);
    }

    @Transactional
    public void deleteBudget(Long id) {
        User user = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with ID: " + id));

        budgetRepository.delete(budget);
    }
}
