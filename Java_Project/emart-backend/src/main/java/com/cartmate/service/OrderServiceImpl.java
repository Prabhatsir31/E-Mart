package com.cartmate.service;

import com.cartmate.dto.OrderItemDto;
import com.cartmate.dto.OrderRequestDto;
import com.cartmate.dto.OrderResponseDto;
import com.cartmate.entity.Cart;
import com.cartmate.entity.CartItem;
import com.cartmate.entity.Orders;
import com.cartmate.entity.Product;
import com.cartmate.entity.User;
import com.cartmate.repository.CartItemRepository;
import com.cartmate.repository.CartRepository;
import com.cartmate.repository.OrderRepository;
import com.cartmate.repository.ProductRepository;
import com.cartmate.repository.UserRepository;
import com.cartmate.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderServiceImpl(CartRepository cartRepository,
                            CartItemRepository cartItemRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OrderResponseDto checkout(Long userId, OrderRequestDto orderRequestDto) {
        User user = userRepository.findById(userId).orElseThrow();
        Cart cart = cartRepository.findByUser_Userid(userId).orElseThrow();

        List<OrderItemDto> orderItems = new ArrayList<>();
        double totalAmount = 0;
        int totalPointsUsed = 0;

        for (OrderItemDto itemDto : orderRequestDto.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId()).orElseThrow();
            double pricePaid = product.getProductprice(); 
            if(user.isIs_cardholder()) {
                pricePaid = product.getLoyalitycardholderprice();
            }
            pricePaid = pricePaid - itemDto.getLoyaltyPointsUsed(); // applying points
            totalAmount += pricePaid * itemDto.getQuantity();
            totalPointsUsed += itemDto.getLoyaltyPointsUsed();

            orderItems.add(itemDto);
        }

        int pointsEarned = (int)(totalAmount * 0.10); // 10% loyalty points
        user.setLoyalitypointbalance(user.getLoyalitypointbalance() - totalPointsUsed + pointsEarned);
        userRepository.save(user);

        Orders order = new Orders();
        order.getUser().setUserid(userId);
        order.setOrderdate(new java.util.Date());
        order.setOrderstatus("PLACED");
        order.setPaymentmethod(orderRequestDto.getPaymentMethod());
        order.setTotalamt(totalAmount);
        order.setLoyalty_point_earned(pointsEarned);
        order.setLoyalty_point_redeemed(totalPointsUsed);
        orderRepository.save(order);

        // Clear the cart
        cartItemRepository.findByCart_Cartid(cart.getCartid()).forEach(cartItemRepository::delete);
        cartRepository.delete(cart);

        OrderResponseDto response = new OrderResponseDto();
        response.setOrderId(order.getOrderid());
        response.setTotalAmount(totalAmount);
        response.setTotalItems(orderItems.size());
        response.setLoyaltyPointsEarned(pointsEarned);
        response.setLoyaltyPointsRedeemed(totalPointsUsed);
        response.setItems(orderItems);

        return response;
    }
}
