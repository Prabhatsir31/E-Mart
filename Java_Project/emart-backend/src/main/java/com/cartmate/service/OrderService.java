package com.cartmate.service;


import com.cartmate.dto.OrderRequestDto;
import com.cartmate.dto.OrderResponseDto;

public interface OrderService {
    OrderResponseDto checkout(Long userId, OrderRequestDto orderRequestDto);
}
