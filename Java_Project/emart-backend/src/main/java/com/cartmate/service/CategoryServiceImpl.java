package com.cartmate.service;

import com.cartmate.dto.CategoryDto;
import com.cartmate.dto.SubcategoryDto;
import com.cartmate.entity.Category;
import com.cartmate.entity.SubCategory;
import com.cartmate.repository.CategoryRepository;
import com.cartmate.repository.SubcategoryRepository;
import com.cartmate.service.CategoryService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, SubcategoryRepository subcategoryRepository) {
        this.categoryRepository = categoryRepository;
        this.subcategoryRepository = subcategoryRepository;
    }

    @Override
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(cat -> {
                    CategoryDto dto = new CategoryDto();
                    dto.setCategoryId(cat.getCategoryid());
                    dto.setCategoryName(cat.getCategoryname());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<SubcategoryDto> getSubcategoriesByCategoryId(Long categoryId) {
//        return subcategoryRepository.findById(categoryId).stream()
//                .map(sub -> {
//                    SubcategoryDto dto = new SubcategoryDto();
//                    dto.setSubcategoryId(sub.getSubcategoryid());
//                    dto.setSubcategoryName(sub.getSubcategoryname());
////                    dto.setCategoryId(sub.getCategoryId());
//                    dto.setCategoryId(sub.getCategory().getCategoryid()); // or getCategoryId() if renamed
//                    return dto;
//                }).collect(Collectors.toList());
        
        return subcategoryRepository.findByCategoryId(categoryId).stream()
                .map(sub -> {
                    SubcategoryDto dto = new SubcategoryDto();
                    dto.setSubcategoryId(sub.getSubcategoryid());
                    dto.setSubcategoryName(sub.getSubcategoryname());
                    dto.setCategoryId(sub.getCategory().getCategoryid());
                    return dto;
                }).collect(Collectors.toList());

    }
}
