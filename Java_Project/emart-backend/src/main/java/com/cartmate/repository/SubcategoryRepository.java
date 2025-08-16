package com.cartmate.repository;

import com.cartmate.entity.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

//public interface SubcategoryRepository extends JpaRepository<SubCategory, Long> {
//    List<SubCategory> findByCategoryId(Long categoryId);
//}


// It fetches all SubCategory records that belong to a specific Category.
@Repository
public interface SubcategoryRepository extends JpaRepository<SubCategory, Long> {

    @Query("SELECT s FROM SubCategory s WHERE s.category.categoryid = :categoryId")
    List<SubCategory> findByCategoryId(@Param("categoryId") Long categoryId);
}




//@Repository
//public interface SubcategoryRepository extends JpaRepository<SubCategory, Long> {
//    List<SubCategory> findByCategoryCategoryId(Long categoryId);
//}
//

//public interface SubcategoryRepository extends JpaRepository<SubCategory, Long> {
////    List<SubCategory> findByCategoryCategoryId(Long categoryId);
//	
//}
