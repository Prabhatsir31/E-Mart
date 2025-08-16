package com.cartmate.service;

import com.cartmate.entity.SubCategory;
import java.util.List;

public interface SubcategoryService {

    // Fetch all subcategories
    List<SubCategory> getAllSubCategories();

    // Fetch subcategories by category ID
    List<SubCategory> getSubCategoriesByCategoryId(Long categoryId);
}
