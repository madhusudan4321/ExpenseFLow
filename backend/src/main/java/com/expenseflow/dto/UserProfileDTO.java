package com.expenseflow.dto;

import java.time.LocalDateTime;

public class UserProfileDTO {

    private Long id;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private long totalExpensesCount;
    private long totalIncomeCount;
    private long totalBudgetsCount;

    public UserProfileDTO() {
    }

    public UserProfileDTO(Long id, String name, String email, LocalDateTime createdAt, long totalExpensesCount, long totalIncomeCount, long totalBudgetsCount) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
        this.totalExpensesCount = totalExpensesCount;
        this.totalIncomeCount = totalIncomeCount;
        this.totalBudgetsCount = totalBudgetsCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getTotalExpensesCount() {
        return totalExpensesCount;
    }

    public void setTotalExpensesCount(long totalExpensesCount) {
        this.totalExpensesCount = totalExpensesCount;
    }

    public long getTotalIncomeCount() {
        return totalIncomeCount;
    }

    public void setTotalIncomeCount(long totalIncomeCount) {
        this.totalIncomeCount = totalIncomeCount;
    }

    public long getTotalBudgetsCount() {
        return totalBudgetsCount;
    }

    public void setTotalBudgetsCount(long totalBudgetsCount) {
        this.totalBudgetsCount = totalBudgetsCount;
    }
}
