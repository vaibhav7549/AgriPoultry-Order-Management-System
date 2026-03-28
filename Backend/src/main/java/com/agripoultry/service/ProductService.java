package com.agripoultry.service;

import com.agripoultry.entity.Product;
import com.agripoultry.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByType(Product.ProductType type) {
        return productRepository.findByType(type);
    }

    public Product updateProduct(Integer id, Product updated) {
        Product existing = getProductById(id);
        existing.setProductName(updated.getProductName());
        existing.setType(updated.getType());
        existing.setDistributorPrice(updated.getDistributorPrice());
        existing.setCompanyPrice(updated.getCompanyPrice());
        return productRepository.save(existing);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}