package com.expenseflow.service;

import com.expenseflow.dto.IncomeDTO;
import com.expenseflow.entity.Income;
import com.expenseflow.entity.User;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.IncomeRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private IncomeDTO convertToDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setAmount(income.getAmount());
        dto.setSource(income.getSource());
        dto.setDescription(income.getDescription());
        dto.setDate(income.getDate());
        dto.setCreatedAt(income.getCreatedAt());
        return dto;
    }

    public List<IncomeDTO> getAllIncomeForCurrentUser() {
        User user = getCurrentUser();
        List<Income> incomes = incomeRepository.findByUserOrderByDateDescCreatedAtDesc(user);
        return incomes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public IncomeDTO getIncomeByIdForCurrentUser(Long id) {
        User user = getCurrentUser();
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));
        return convertToDTO(income);
    }

    @Transactional
    public IncomeDTO createIncome(IncomeDTO dto) {
        User user = getCurrentUser();

        Income income = new Income(
                dto.getAmount(),
                dto.getSource(),
                dto.getDescription(),
                dto.getDate(),
                user
        );

        Income saved = incomeRepository.save(income);
        return convertToDTO(saved);
    }

    @Transactional
    public IncomeDTO updateIncome(Long id, IncomeDTO dto) {
        User user = getCurrentUser();
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));

        income.setAmount(dto.getAmount());
        income.setSource(dto.getSource());
        income.setDescription(dto.getDescription());
        income.setDate(dto.getDate());

        Income saved = incomeRepository.save(income);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteIncome(Long id) {
        User user = getCurrentUser();
        Income income = incomeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Income record not found with ID: " + id));

        incomeRepository.delete(income);
    }
}
