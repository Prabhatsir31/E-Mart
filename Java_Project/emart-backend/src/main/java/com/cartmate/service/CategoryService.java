package com.cartmate.service;

import com.cartmate.dto.CategoryDto;
import com.cartmate.dto.SubcategoryDto;
import java.util.List;

public interface CategoryService {
    List<CategoryDto> getAllCategories();
    List<SubcategoryDto> getSubcategoriesByCategoryId(Long categoryId);
}
