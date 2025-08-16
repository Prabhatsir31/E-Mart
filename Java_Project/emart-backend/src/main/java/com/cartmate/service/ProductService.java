package com.cartmate.service;


import com.cartmate.dto.ProductDto;
import java.util.List;

public interface ProductService {
    List<ProductDto> getProductsBySubcategoryId(Long subcategoryId);
    ProductDto getProductById(Long productId);
}
