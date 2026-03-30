package com.agripoultry.service;

import com.agripoultry.entity.Product;
import com.agripoultry.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    public List<Map<String, Object>> getAll() {
        return repo.findAll().stream().map(this::toMap).toList();
    }

    public Map<String, Object> update(Integer id, Map<String, Object> updates) {
        Product p = repo.findById(id).orElseThrow(() -> new RuntimeException("Product not found: " + id));
        if (updates.containsKey("stock")) p.setStock((String) updates.get("stock"));
        if (updates.containsKey("description")) p.setDescription((String) updates.get("description"));
        repo.save(p);
        return toMap(p);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> create(Map<String, Object> data) {
        Product p = Product.builder()
                .productCode((String) data.get("id"))
                .productName((String) data.get("name"))
                .category((String) data.get("category"))
                .unit((String) data.get("unit"))
                .emoji((String) data.get("emoji"))
                .stock((String) data.get("stock"))
                .minOrder(data.get("minOrder") != null ? ((Number) data.get("minOrder")).intValue() : null)
                .description((String) data.get("description"))
                .build();
        if (data.get("basePrice") != null) p.setCostPrice(java.math.BigDecimal.valueOf(((Number) data.get("basePrice")).doubleValue()));
        if (data.get("suggestedDistributorPrice") != null) p.setSuggestedDistributorPrice(java.math.BigDecimal.valueOf(((Number) data.get("suggestedDistributorPrice")).doubleValue()));
        if (data.get("suggestedFarmerPrice") != null) p.setSuggestedFarmerPrice(java.math.BigDecimal.valueOf(((Number) data.get("suggestedFarmerPrice")).doubleValue()));
        repo.save(p);
        return toMap(p);
    }

    private Map<String, Object> toMap(Product p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getProductCode() != null ? p.getProductCode() : "p" + p.getProductId());
        m.put("name", p.getProductName());
        m.put("category", p.getCategory());
        m.put("unit", p.getUnit());
        m.put("basePrice", p.getCostPrice() != null ? p.getCostPrice().intValue() : 0);
        m.put("suggestedDistributorPrice", p.getSuggestedDistributorPrice() != null ? p.getSuggestedDistributorPrice().intValue() : 0);
        m.put("suggestedFarmerPrice", p.getSuggestedFarmerPrice() != null ? p.getSuggestedFarmerPrice().intValue() : 0);
        m.put("emoji", p.getEmoji());
        m.put("stock", p.getStock());
        m.put("minOrder", p.getMinOrder());
        m.put("description", p.getDescription());
        return m;
    }
}