package com.cartmate.dto;

public class OrderItemDto {
    private Long productId;
    private int quantity;
    private double pricePaid;
    private int loyaltyPointsUsed;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPricePaid() { return pricePaid; }
    public void setPricePaid(double pricePaid) { this.pricePaid = pricePaid; }
    public int getLoyaltyPointsUsed() { return loyaltyPointsUsed; }
    public void setLoyaltyPointsUsed(int loyaltyPointsUsed) { this.loyaltyPointsUsed = loyaltyPointsUsed; }
}
