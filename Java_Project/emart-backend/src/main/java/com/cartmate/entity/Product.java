package com.cartmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "product_master")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productid;

    private String brandname;
    private boolean is_specialoffer;
    private String longdescription;
    private double loyalitycardholderprice;
    private String productimage;
    private String productname;
    private double productprice;
    private int productstock;
    private int reedempointrequired;
    private String shortdescription;

    @ManyToOne
    @JoinColumn(name = "subcategoriesid", nullable = false)
    private SubCategory subcategory;

    // Getters and Setters
    public Long getProductid() {
        return productid;
    }

    public void setProductid(Long productid) {
        this.productid = productid;
    }

    public String getBrandname() {
        return brandname;
    }

    public void setBrandname(String brandname) {
        this.brandname = brandname;
    }

    public boolean isIs_specialoffer() {
        return is_specialoffer;
    }

    public void setIs_specialoffer(boolean is_specialoffer) {
        this.is_specialoffer = is_specialoffer;
    }

    public String getLongdescription() {
        return longdescription;
    }

    public void setLongdescription(String longdescription) {
        this.longdescription = longdescription;
    }

    public double getLoyalitycardholderprice() {
        return loyalitycardholderprice;
    }

    public void setLoyalitycardholderprice(double loyalitycardholderprice) {
        this.loyalitycardholderprice = loyalitycardholderprice;
    }

    public String getProductimage() {
        return productimage;
    }

    public void setProductimage(String productimage) {
        this.productimage = productimage;
    }

    public String getProductname() {
        return productname;
    }

    public void setProductname(String productname) {
        this.productname = productname;
    }

    public double getProductprice() {
        return productprice;
    }

    public void setProductprice(double productprice) {
        this.productprice = productprice;
    }

    public int getProductstock() {
        return productstock;
    }

    public void setProductstock(int productstock) {
        this.productstock = productstock;
    }

    public int getReedempointrequired() {
        return reedempointrequired;
    }

    public void setReedempointrequired(int reedempointrequired) {
        this.reedempointrequired = reedempointrequired;
    }

    public String getShortdescription() {
        return shortdescription;
    }

    public void setShortdescription(String shortdescription) {
        this.shortdescription = shortdescription;
    }

    public SubCategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(SubCategory subcategory) {
        this.subcategory = subcategory;
    }
}
