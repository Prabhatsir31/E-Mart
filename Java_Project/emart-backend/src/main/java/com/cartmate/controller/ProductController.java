package com.cartmate.controller;

import com.cartmate.dto.ProductDto;
import com.cartmate.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/subcategory/{subcategoryId}")
    public List<ProductDto> getProductsBySubcategory(@PathVariable Long subcategoryId) {
        return productService.getProductsBySubcategoryId(subcategoryId);
    }

    @GetMapping("/{productId}")
    public ProductDto getProductById(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }
}
