package com.expenseflow.service;

import com.expenseflow.dto.CategoryDTO;
import com.expenseflow.entity.Category;
import com.expenseflow.entity.User;
import com.expenseflow.exception.BadRequestException;
import com.expenseflow.exception.ResourceNotFoundException;
import com.expenseflow.repository.CategoryRepository;
import com.expenseflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    private static final List<String> DEFAULT_CATEGORIES = Arrays.asList(
            "Food", "Shopping", "Transportation", "Bills",
            "Entertainment", "Healthcare", "Education", "Travel", "Other"
    );

    @Transactional
    public void createDefaultCategoriesForUser(User user) {
        for (String catName : DEFAULT_CATEGORIES) {
            if (!categoryRepository.existsByNameAndUser(catName, user)) {
                Category category = new Category(catName, user);
                categoryRepository.save(category);
            }
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    public List<CategoryDTO> getCategoriesForCurrentUser() {
        User user = getCurrentUser();
        List<Category> categories = categoryRepository.findByUser(user);
        return categories.stream()
                .map(cat -> new CategoryDTO(cat.getId(), cat.getName()))
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO dto) {
        User user = getCurrentUser();

        if (categoryRepository.existsByNameAndUser(dto.getName().trim(), user)) {
            throw new BadRequestException("Category with name '" + dto.getName() + "' already exists.");
        }

        Category category = new Category(dto.getName().trim(), user);
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved.getId(), saved.getName());
    }

    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryDTO dto) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        String newName = dto.getName().trim();
        if (!category.getName().equalsIgnoreCase(newName) && categoryRepository.existsByNameAndUser(newName, user)) {
            throw new BadRequestException("Category with name '" + newName + "' already exists.");
        }

        category.setName(newName);
        Category saved = categoryRepository.save(category);
        return new CategoryDTO(saved.getId(), saved.getName());
    }

    @Transactional
    public void deleteCategory(Long id) {
        User user = getCurrentUser();
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        categoryRepository.delete(category);
    }
}
