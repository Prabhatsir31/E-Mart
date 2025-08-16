package com.cartmate.dto;


import java.util.List;

public class OrderRequestDto {
    private List<OrderItemDto> items;
    private String paymentMethod; // e.g., CREDIT_CARD, COD
    private String deliveryOption; // COURIER / PICKUP

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getDeliveryOption() { return deliveryOption; }
    public void setDeliveryOption(String deliveryOption) { this.deliveryOption = deliveryOption; }
}
