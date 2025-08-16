package com.cartmate.repository;

import com.cartmate.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

//public interface ProductRepository extends JpaRepository<Product, Long> {
////    List<Product> findBySubcategoryId(Long subcategoryId);
//	@Query("SELECT p FROM Product p WHERE p.subcategory.subcategoryId = :id")
//	List<Product> findBySubcategoryId(@Param("id") Long id);
//
//}


@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.subcategory.subcategoryid = :id")
    List<Product> findBySubcategoryId(@Param("id") Long id);
}


