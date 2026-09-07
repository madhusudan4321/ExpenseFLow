package com.expenseflow.service;

import com.expenseflow.dto.ExpenseDTO;
import com.expenseflow.entity.Category;
import com.expenseflow.entity.Expense;
import com.expenseflow.entity.User;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.CategoryRepository;
import com.expenseflow.repository.ExpenseRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private ExpenseDTO convertToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());
        dto.setDate(expense.getDate());
        dto.setPaymentMethod(expense.getPaymentMethod());
        if (expense.getCategory() != null) {
            dto.setCategoryId(expense.getCategory().getId());
            dto.setCategoryName(expense.getCategory().getName());
        }
        dto.setCreatedAt(expense.getCreatedAt());
        return dto;
    }

    public List<ExpenseDTO> getAllExpensesForCurrentUser() {
        User user = getCurrentUser();
        List<Expense> expenses = expenseRepository.findByUserOrderByDateDescCreatedAtDesc(user);
        return expenses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ExpenseDTO getExpenseByIdForCurrentUser(Long id) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));
        return convertToDTO(expense);
    }

    @Transactional
    public ExpenseDTO createExpense(ExpenseDTO dto) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(dto.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Expense expense = new Expense(
                dto.getAmount(),
                dto.getDescription(),
                dto.getDate(),
                dto.getPaymentMethod(),
                category,
                user
        );

        Expense saved = expenseRepository.save(expense);
        return convertToDTO(saved);
    }

    @Transactional
    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        Category category = categoryRepository.findByIdAndUser(dto.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setDate(dto.getDate());
        expense.setPaymentMethod(dto.getPaymentMethod());
        expense.setCategory(category);

        Expense saved = expenseRepository.save(expense);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteExpense(Long id) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with ID: " + id));

        expenseRepository.delete(expense);
    }
}
