package com.expenseflow.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BudgetDTO {

    private Long id;

    @NotNull(message = "Budget amount cannot be missing")
    @DecimalMin(value = "0.01", message = "Budget amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Month cannot be missing")
    @Min(1)
    @Max(12)
    private Integer month;

    @NotNull(message = "Year cannot be missing")
    @Min(2000)
    @Max(2100)
    private Integer year;

    @NotNull(message = "Category ID cannot be missing")
    private Long categoryId;

    private String categoryName;

    public BudgetDTO() {
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
