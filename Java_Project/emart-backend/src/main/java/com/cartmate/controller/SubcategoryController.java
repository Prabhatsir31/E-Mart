package com.cartmate.controller;

import com.cartmate.entity.SubCategory;
import com.cartmate.service.SubcategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subcategories")
public class SubcategoryController {

    private final SubcategoryService subcategoryService;

    public SubcategoryController(SubcategoryService subcategoryService) {
        this.subcategoryService = subcategoryService;
    }

    //  Get all subcategories
    @GetMapping
    public ResponseEntity<List<SubCategory>> getAllSubcategories() {
        List<SubCategory> subcategories = subcategoryService.getAllSubCategories();
        return ResponseEntity.ok(subcategories);
    }

    // Get subcategories by category ID
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubCategory>> getSubcategoriesByCategory(@PathVariable Long categoryId) {
        List<SubCategory> subcategories = subcategoryService.getSubCategoriesByCategoryId(categoryId);
        return ResponseEntity.ok(subcategories);
    }
}
