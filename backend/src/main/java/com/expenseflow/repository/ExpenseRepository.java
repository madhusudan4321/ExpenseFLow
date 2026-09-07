package com.expenseflow.repository;

import com.expenseflow.entity.Category;
import com.expenseflow.entity.Expense;
import com.expenseflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUserOrderByDateDescCreatedAtDesc(User user);
    Optional<Expense> findByIdAndUser(Long id, User user);
    List<Expense> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);
    List<Expense> findByUserAndCategoryAndDateBetween(User user, Category category, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user")
    BigDecimal sumTotalByUser(@Param("user") User user);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user = :user AND e.category = :category AND e.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndCategoryAndDateBetween(@Param("user") User user, @Param("category") Category category, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Expense> findTop5ByUserOrderByDateDescCreatedAtDesc(User user);
}
