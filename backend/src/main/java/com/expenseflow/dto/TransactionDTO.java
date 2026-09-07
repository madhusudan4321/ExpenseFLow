package com.expenseflow.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDTO {

    private Long id;
    private String type; // "INCOME" or "EXPENSE"
    private BigDecimal amount;
    private String description;
    private String categoryOrSource;
    private String detail; // Payment method for expense, source for income
    private LocalDate date;
    private LocalDateTime createdAt;

    public TransactionDTO() {
    }

    public TransactionDTO(Long id, String type, BigDecimal amount, String description, String categoryOrSource, String detail, LocalDate date, LocalDateTime createdAt) {
        this.id = id;
        this.type = type;
        this.amount = amount;
        this.description = description;
        this.categoryOrSource = categoryOrSource;
        this.detail = detail;
        this.date = date;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategoryOrSource() {
        return categoryOrSource;
    }

    public void setCategoryOrSource(String categoryOrSource) {
        this.categoryOrSource = categoryOrSource;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
