package com.cartmate.controller;

import com.cartmate.dto.CategoryDto;
import com.cartmate.dto.SubcategoryDto;
import com.cartmate.service.CategoryService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDto> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{categoryId}/subcategories")
    public List<SubcategoryDto> getSubcategoriesByCategory(@PathVariable Long categoryId) {
        return categoryService.getSubcategoriesByCategoryId(categoryId);
    }
}
