package com.expenseflow.controller;

import com.expenseflow.dto.UserProfileDTO;
import com.expenseflow.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile() {
        return ResponseEntity.ok(userService.getCurrentUserProfile());
    }
}
