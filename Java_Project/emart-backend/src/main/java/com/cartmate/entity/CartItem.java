package com.cartmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cartitem")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartitemid;

    private int loyalitypointused;
    private double priceaddition;
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "cartid", nullable = false)
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "productid", nullable = false)
    private Product product;

    // Getters and Setters
    public Long getCartitemid() {
        return cartitemid;
    }

    public void setCartitemid(Long cartitemid) {
        this.cartitemid = cartitemid;
    }

    public int getLoyalitypointused() {
        return loyalitypointused;
    }

    public void setLoyalitypointused(int loyalitypointused) {
        this.loyalitypointused = loyalitypointused;
    }

    public double getPriceaddition() {
        return priceaddition;
    }

    public void setPriceaddition(double priceaddition) {
        this.priceaddition = priceaddition;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
