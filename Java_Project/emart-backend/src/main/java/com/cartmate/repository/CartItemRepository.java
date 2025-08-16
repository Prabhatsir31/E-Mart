//package com.cartmate.repository;
//
//import com.cartmate.entity.CartItem;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.List;
//
//public interface CartItemRepository extends JpaRepository<CartItem, Long> {
//    List<CartItem> findByCartId(Long cartId);
//    void deleteByCartIdAndProductId(Long cartId, Long productId);
//}

package com.cartmate.repository;

import com.cartmate.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByCart_Cartid(Long cartId); // Updated method name
    void deleteByCart_CartidAndProductid(Long cartId, Long productId); // Updated method name}