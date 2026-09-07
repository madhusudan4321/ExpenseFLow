package com.expenseflow.repository;

import com.expenseflow.entity.Budget;
import com.expenseflow.entity.Category;
import com.expenseflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);
    Optional<Budget> findByIdAndUser(Long id, User user);
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Category category, Integer month, Integer year);
    boolean existsByUserAndCategoryAndMonthAndYear(User user, Category category, Integer month, Integer year);
}
