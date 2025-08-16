package com.cartmate.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderid;

    private int loyalty_point_earned;
    private int loyalty_point_redeemed;

    @Temporal(TemporalType.TIMESTAMP)
    private Date orderdate;

    private String orderstatus;
    private String paymentmethod;
    private double totalamt;

    @ManyToOne
    @JoinColumn(name = "userid", nullable = false)
    private User user;

    // Getters and Setters
    public Long getOrderid() {
        return orderid;
    }

    public void setOrderid(Long orderid) {
        this.orderid = orderid;
    }

    public int getLoyalty_point_earned() {
        return loyalty_point_earned;
    }

    public void setLoyalty_point_earned(int loyalty_point_earned) {
        this.loyalty_point_earned = loyalty_point_earned;
    }

    public int getLoyalty_point_redeemed() {
        return loyalty_point_redeemed;
    }

    public void setLoyalty_point_redeemed(int loyalty_point_redeemed) {
        this.loyalty_point_redeemed = loyalty_point_redeemed;
    }

    public Date getOrderdate() {
        return orderdate;
    }

    public void setOrderdate(Date orderdate) {
        this.orderdate = orderdate;
    }

    public String getOrderstatus() {
        return orderstatus;
    }

    public void setOrderstatus(String orderstatus) {
        this.orderstatus = orderstatus;
    }

    public String getPaymentmethod() {
        return paymentmethod;
    }

    public void setPaymentmethod(String paymentmethod) {
        this.paymentmethod = paymentmethod;
    }

    public double getTotalamt() {
        return totalamt;
    }

    public void setTotalamt(double totalamt) {
        this.totalamt = totalamt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
