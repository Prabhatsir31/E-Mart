package com.cartmate.repository;

import com.cartmate.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

//public interface CartRepository extends JpaRepository<Cart, Long> {
//    Optional<Cart> findByUserid(Long userid);
//    
//}

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser_Userid(Long userid);
}
