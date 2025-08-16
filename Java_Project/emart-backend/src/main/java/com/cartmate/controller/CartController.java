package com.cartmate.controller;

import com.cartmate.dto.CartItemDto;
import com.cartmate.dto.CartResponseDto;
import com.cartmate.service.CartService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponseDto getCart(@AuthenticationPrincipal Long userId) {
        return cartService.getCartByUser(userId);
    }

    @PostMapping("/add")
    public CartResponseDto addToCart(@AuthenticationPrincipal Long userId,
                                     @RequestBody CartItemDto cartItemDto) {
        return cartService.addToCart(userId, cartItemDto);
    }

    @PutMapping("/update")
    public CartResponseDto updateCart(@AuthenticationPrincipal Long userId,
                                      @RequestBody CartItemDto cartItemDto) {
        return cartService.updateCartItem(userId, cartItemDto);
    }

    @DeleteMapping("/remove/{productId}")
    public CartResponseDto removeFromCart(@AuthenticationPrincipal Long userId,
                                          @PathVariable Long productId) {
        return cartService.removeFromCart(userId, productId);
    }
}
