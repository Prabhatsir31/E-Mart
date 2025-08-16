package com.cartmate.service;

import com.cartmate.dto.ProductDto;
import com.cartmate.entity.Product;
import com.cartmate.repository.ProductRepository;
import com.cartmate.service.ProductService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDto> getProductsBySubcategoryId(Long subcategoryId) {
        return productRepository.findBySubcategoryId(subcategoryId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto getProductById(Long productId) {
        return productRepository.findById(productId)
                .map(this::mapToDto)
                .orElse(null);
    }

    private ProductDto mapToDto(Product product) {
        ProductDto dto = new ProductDto();
        dto.setProductId(product.getProductid());
        dto.setProductName(product.getProductname());
        dto.setDescription(product.getLongdescription());
        dto.setPriceNormal(product.getProductprice());
        dto.setPriceCardholder(product.getLoyalitycardholderprice());
        dto.setSubcategoryId(product.getSubcategory().getSubcategoryid());
        return dto;
    }
}
