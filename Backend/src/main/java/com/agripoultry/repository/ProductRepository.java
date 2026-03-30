package com.agripoultry.repository;

import com.agripoultry.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByType(Product.ProductType type);
    List<Product> findByCategory(String category);
    Optional<Product> findByProductCode(String productCode);
}