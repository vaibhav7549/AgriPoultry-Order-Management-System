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

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private ProductType type;

    // Price distributor pays to company
    @Column(name = "distributor_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal distributorPrice;

    // Price company charges (base/reference price)
    @Column(name = "company_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal companyPrice;

    public enum ProductType {
        FEED, CHICKS
    }
}