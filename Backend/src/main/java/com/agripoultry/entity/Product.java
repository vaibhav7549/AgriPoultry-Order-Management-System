package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_code", unique = true, length = 20)
    private String productCode;

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "unit", length = 30)
    private String unit;

    @Column(name = "cost_price", precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "suggested_distributor_price", precision = 10, scale = 2)
    private BigDecimal suggestedDistributorPrice;

    @Column(name = "suggested_farmer_price", precision = 10, scale = 2)
    private BigDecimal suggestedFarmerPrice;

    // Price distributor pays to company (kept for backward compat)
    @Column(name = "distributor_price", precision = 10, scale = 2)
    private BigDecimal distributorPrice;

    // Price company charges (base/reference price)
    @Column(name = "company_price", precision = 10, scale = 2)
    private BigDecimal companyPrice;

    @Column(name = "emoji", length = 10)
    private String emoji;

    @Column(name = "stock", length = 20)
    private String stock;

    @Column(name = "min_order")
    private Integer minOrder;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ProductType type;

    public enum ProductType {
        FEED, CHICKS, HEALTHCARE
    }
}