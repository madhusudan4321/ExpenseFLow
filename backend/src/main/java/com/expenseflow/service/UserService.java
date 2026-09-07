package com.expenseflow.service;

import com.expenseflow.dto.UserProfileDTO;
import com.expenseflow.entity.User;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.BudgetRepository;
import com.expenseflow.repository.ExpenseRepository;
import com.expenseflow.repository.IncomeRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public UserProfileDTO getCurrentUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        long expenseCount = expenseRepository.findByUserOrderByDateDescCreatedAtDesc(user).size();
        long incomeCount = incomeRepository.findByUserOrderByDateDescCreatedAtDesc(user).size();
        long budgetCount = budgetRepository.findByUser(user).size();

        return new UserProfileDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getCreatedAt(),
                expenseCount,
                incomeCount,
                budgetCount
        );
    }
}
