package com.expenseflow.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {

    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal currentBalance;
    
    private BigDecimal currentMonthSpending;
    private BigDecimal currentMonthBudgetTotal;
    private BigDecimal currentMonthBudgetRemaining;

    private List<TransactionDTO> recentTransactions;
    private Map<String, BigDecimal> categoryExpenses;
    private List<MonthlyData> monthlyComparison;

    public static class MonthlyData {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;

        public MonthlyData() {
        }

        public MonthlyData(String month, BigDecimal income, BigDecimal expense) {
            this.month = month;
            this.income = income;
            this.expense = expense;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public BigDecimal getIncome() {
            return income;
        }

        public void setIncome(BigDecimal income) {
            this.income = income;
        }

        public BigDecimal getExpense() {
            return expense;
        }

        public void setExpense(BigDecimal expense) {
            this.expense = expense;
        }
    }

    public DashboardSummaryDTO() {
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getCurrentBalance() {
        return currentBalance;
    }

    public void setCurrentBalance(BigDecimal currentBalance) {
        this.currentBalance = currentBalance;
    }

    public BigDecimal getCurrentMonthSpending() {
        return currentMonthSpending;
    }

    public void setCurrentMonthSpending(BigDecimal currentMonthSpending) {
        this.currentMonthSpending = currentMonthSpending;
    }

    public BigDecimal getCurrentMonthBudgetTotal() {
        return currentMonthBudgetTotal;
    }

    public void setCurrentMonthBudgetTotal(BigDecimal currentMonthBudgetTotal) {
        this.currentMonthBudgetTotal = currentMonthBudgetTotal;
    }

    public BigDecimal getCurrentMonthBudgetRemaining() {
        return currentMonthBudgetRemaining;
    }

    public void setCurrentMonthBudgetRemaining(BigDecimal currentMonthBudgetRemaining) {
        this.currentMonthBudgetRemaining = currentMonthBudgetRemaining;
    }

    public List<TransactionDTO> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionDTO> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public Map<String, BigDecimal> getCategoryExpenses() {
        return categoryExpenses;
    }

    public void setCategoryExpenses(Map<String, BigDecimal> categoryExpenses) {
        this.categoryExpenses = categoryExpenses;
    }

    public List<MonthlyData> getMonthlyComparison() {
        return monthlyComparison;
    }

    public void setMonthlyComparison(List<MonthlyData> monthlyComparison) {
        this.monthlyComparison = monthlyComparison;
    }
}
