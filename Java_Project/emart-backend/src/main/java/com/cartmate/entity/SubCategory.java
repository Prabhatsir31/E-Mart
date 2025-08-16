package com.cartmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subcategory_master")
public class SubCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subcategoryid;

    private String subcategoryname;
    private String subcategoryimage;

    @ManyToOne
    @JoinColumn(name = "categoryid", nullable = false)
    private Category category;

    // Getters and Setters
    public Long getSubcategoryid() {
        return subcategoryid;
    }

    public void setSubcategoryid(Long subcategoryid) {
        this.subcategoryid = subcategoryid;
    }

    public String getSubcategoryname() {
        return subcategoryname;
    }

    public void setSubcategoryname(String subcategoryname) {
        this.subcategoryname = subcategoryname;
    }

    public String getSubcategoryimage() {
        return subcategoryimage;
    }

    public void setSubcategoryimage(String subcategoryimage) {
        this.subcategoryimage = subcategoryimage;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
}
