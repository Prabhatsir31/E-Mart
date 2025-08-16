package com.cartmate.dto;

public class CartItemDto {
    private Long productId;
    private int quantity;
    private int loyaltyPointsUsed; // optional if using points
    private double priceAddition;   // extra charges if any

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public int getLoyaltyPointsUsed() { return loyaltyPointsUsed; }
    public void setLoyaltyPointsUsed(int loyaltyPointsUsed) { this.loyaltyPointsUsed = loyaltyPointsUsed; }
    public double getPriceAddition() { return priceAddition; }
    public void setPriceAddition(double priceAddition) { this.priceAddition = priceAddition; }
}
