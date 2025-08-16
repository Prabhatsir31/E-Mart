package com.cartmate.dto;

public class ProductDto {
    private Long productId;
    private String productName;
    private String description;
    private Double priceNormal;
    private Double priceCardholder;
    private Long subcategoryId;

    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Double getPriceNormal() {
        return priceNormal;
    }
    public void setPriceNormal(Double priceNormal) {
        this.priceNormal = priceNormal;
    }
    public Double getPriceCardholder() {
        return priceCardholder;
    }
    public void setPriceCardholder(Double priceCardholder) {
        this.priceCardholder = priceCardholder;
    }
    public Long getSubcategoryId() {
        return subcategoryId;
    }
    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
    }
}
