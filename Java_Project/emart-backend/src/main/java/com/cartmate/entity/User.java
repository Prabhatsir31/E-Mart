package com.cartmate.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordhash;

    private String address;
    private String phonenumber;

    @Column(nullable = false)
    private boolean is_cardholder;

    @Column(nullable = false)
    private int loyalitypointbalance;

    @Temporal(TemporalType.DATE)
    private Date registrationdate;

    // Getters and Setters
    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordhash() {
        return passwordhash;
    }

    public void setPasswordhash(String passwordhash) {
        this.passwordhash = passwordhash;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhonenumber() {
        return phonenumber;
    }

    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }

    public boolean isIs_cardholder() {
        return is_cardholder;
    }

    public void setIs_cardholder(boolean is_cardholder) {
        this.is_cardholder = is_cardholder;
    }

    public int getLoyalitypointbalance() {
        return loyalitypointbalance;
    }

    public void setLoyalitypointbalance(int loyalitypointbalance) {
        this.loyalitypointbalance = loyalitypointbalance;
    }

    public Date getRegistrationdate() {
        return registrationdate;
    }

    public void setRegistrationdate(Date registrationdate) {
        this.registrationdate = registrationdate;
    }
}
