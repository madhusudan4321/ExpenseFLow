package com.expenseflow.repository;

import com.expenseflow.entity.Income;
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
public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByUserOrderByDateDescCreatedAtDesc(User user);
    Optional<Income> findByIdAndUser(Long id, User user);
    List<Income> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user = :user")
    BigDecimal sumTotalByUser(@Param("user") User user);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user = :user AND i.date BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserAndDateBetween(@Param("user") User user, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Income> findTop5ByUserOrderByDateDescCreatedAtDesc(User user);
}
