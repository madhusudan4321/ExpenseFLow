package com.expenseflow.controller;

import com.expenseflow.dto.IncomeDTO;
import com.expenseflow.service.IncomeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/income")
public class IncomeController {

    @Autowired
    private IncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<IncomeDTO>> getAllIncome() {
        return ResponseEntity.ok(incomeService.getAllIncomeForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncomeDTO> getIncomeById(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.getIncomeByIdForCurrentUser(id));
    }

    @PostMapping
    public ResponseEntity<IncomeDTO> createIncome(@Valid @RequestBody IncomeDTO dto) {
        IncomeDTO created = incomeService.createIncome(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeDTO> updateIncome(@PathVariable Long id, @Valid @RequestBody IncomeDTO dto) {
        IncomeDTO updated = incomeService.updateIncome(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
        return ResponseEntity.noContent().build();
    }
}
