package com.cartmate.dto;

public class UserRegistrationDto {
    private String username;
    private String email;
    private String password;
    private String address;
    private String phonenumber;
    private boolean isCardholder;

    // Getters and Setters
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public boolean isCardholder() {
        return isCardholder;
    }

    public void setCardholder(boolean cardholder) {
        isCardholder = cardholder;
    }
}
