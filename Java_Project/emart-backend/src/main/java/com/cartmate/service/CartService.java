package com.cartmate.service;

import com.cartmate.dto.CartItemDto;
import com.cartmate.dto.CartResponseDto;

public interface CartService {
    CartResponseDto getCartByUser(Long userId);
    CartResponseDto addToCart(Long userId, CartItemDto cartItemDto);
    CartResponseDto removeFromCart(Long userId, Long productId);
    CartResponseDto updateCartItem(Long userId, CartItemDto cartItemDto);
}
