package com.cartmate.service;

import com.cartmate.dto.CartItemDto;
import com.cartmate.dto.CartResponseDto;
import com.cartmate.entity.Cart;
import com.cartmate.entity.CartItem;
import com.cartmate.entity.Product;
import com.cartmate.repository.CartItemRepository;
import com.cartmate.repository.CartRepository;
import com.cartmate.repository.ProductRepository;
import com.cartmate.service.CartService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    @Override
    public CartResponseDto getCartByUser(Long userId) {
        Cart cart = cartRepository.findByUser_Userid(userId).orElse(null);
        CartResponseDto response = new CartResponseDto();
        if(cart == null) return response;
        List<CartItem> items = cartItemRepository.findByCart_Cartid(cart.getCartid());
        List<CartItemDto> itemDtos = new ArrayList<>();
        double total = 0;
        for(CartItem ci : items){
            Product product = productRepository.findById(ci.getProduct().getProductid()).orElse(null);
            if(product != null){
                CartItemDto dto = new CartItemDto();
                dto.setProductId(product.getProductid());
                dto.setQuantity(ci.getQuantity());
                dto.setPriceAddition(ci.getPriceaddition());
                dto.setLoyaltyPointsUsed(ci.getLoyalitypointused());
                total += (product.getProductprice() + ci.getPriceaddition()) * ci.getQuantity();
                itemDtos.add(dto);
            }
        }
        response.setCartId(cart.getCartid());
        response.setItems(itemDtos);
        response.setTotalAmount(total);
        response.setTotalItems(itemDtos.size());
        return response;
    }

    @Override
    public CartResponseDto addToCart(Long userId, CartItemDto cartItemDto) {
        Cart cart = cartRepository.findByUser_Userid(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.getUser().setUserid(userId);
            c.setCreateddate(new java.util.Date());
            return cartRepository.save(c);
        });

        CartItem cartItem = new CartItem();
        cartItem.getCart().setCartid(cart.getCartid());
        cartItem.getProduct().setProductid(cartItemDto.getProductId());
        cartItem.setQuantity(cartItemDto.getQuantity());
        cartItem.setPriceaddition(cartItemDto.getPriceAddition());
        cartItem.setLoyalitypointused(cartItemDto.getLoyaltyPointsUsed());

        cartItemRepository.save(cartItem);
        return getCartByUser(userId);
    }

    @Override
    public CartResponseDto removeFromCart(Long userId, Long productId) {
        Cart cart = cartRepository.findByUser_Userid(userId).orElse(null);
        if(cart != null){
            cartItemRepository.deleteByCart_CartidAndProductid(cart.getCartid(), productId);
        }
        return getCartByUser(userId);
    }

    @Override
    public CartResponseDto updateCartItem(Long userId, CartItemDto cartItemDto) {
        Cart cart = cartRepository.findByUser_Userid(userId).orElse(null);
        if(cart != null){
            List<CartItem> items = cartItemRepository.findByCart_Cartid(cart.getCartid());
            for(CartItem ci : items){
                if(ci.getProduct().getProductid().equals(cartItemDto.getProductId())){
                    ci.setQuantity(cartItemDto.getQuantity());
                    ci.setPriceaddition(cartItemDto.getPriceAddition());
                    ci.setLoyalitypointused(cartItemDto.getLoyaltyPointsUsed());
                    cartItemRepository.save(ci);
                    break;
                }
            }
        }
        return getCartByUser(userId);
        
        
        
        
    }
}
