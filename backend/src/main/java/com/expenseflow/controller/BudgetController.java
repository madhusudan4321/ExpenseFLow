package com.expenseflow.controller;

import com.expenseflow.dto.BudgetDTO;
import com.expenseflow.dto.BudgetSummaryDTO;
import com.expenseflow.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetSummaryDTO>> getBudgets(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(budgetService.getAllBudgetsForCurrentUser(month, year));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BudgetSummaryDTO> getBudgetById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetService.getBudgetById(id));
    }

    @PostMapping
    public ResponseEntity<BudgetSummaryDTO> createBudget(@Valid @RequestBody BudgetDTO dto) {
        BudgetSummaryDTO created = budgetService.createBudget(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BudgetSummaryDTO> updateBudget(@PathVariable Long id, @Valid @RequestBody BudgetDTO dto) {
        BudgetSummaryDTO updated = budgetService.updateBudget(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.noContent().build();
    }
}
