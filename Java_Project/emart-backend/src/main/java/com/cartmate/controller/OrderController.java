package com.cartmate.controller;

import com.cartmate.dto.OrderRequestDto;
import com.cartmate.dto.OrderResponseDto;
import com.cartmate.service.OrderService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public OrderResponseDto checkout(@AuthenticationPrincipal Long userId,
                                     @RequestBody OrderRequestDto orderRequestDto) {
        return orderService.checkout(userId, orderRequestDto);
    }
}
