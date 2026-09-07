package com.expenseflow.dto;

import java.math.BigDecimal;

public class BudgetSummaryDTO {

    private Long id;
    private BigDecimal amount;
    private BigDecimal spent;
    private BigDecimal remaining;
    private Double percentageUsed;
    private Integer month;
    private Integer year;
    private Long categoryId;
    private String categoryName;

    public BudgetSummaryDTO() {
    }

    public BudgetSummaryDTO(Long id, BigDecimal amount, BigDecimal spent, BigDecimal remaining, Double percentageUsed, Integer month, Integer year, Long categoryId, String categoryName) {
        this.id = id;
        this.amount = amount;
        this.spent = spent;
        this.remaining = remaining;
        this.percentageUsed = percentageUsed;
        this.month = month;
        this.year = year;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getSpent() {
        return spent;
    }

    public void setSpent(BigDecimal spent) {
        this.spent = spent;
    }

    public BigDecimal getRemaining() {
        return remaining;
    }

    public void setRemaining(BigDecimal remaining) {
        this.remaining = remaining;
    }

    public Double getPercentageUsed() {
        return percentageUsed;
    }

    public void setPercentageUsed(Double percentageUsed) {
        this.percentageUsed = percentageUsed;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
