package com.agripoultry.repository;

import com.agripoultry.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByType(Product.ProductType type);
}