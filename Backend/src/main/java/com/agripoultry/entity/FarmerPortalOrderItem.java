package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "farmer_portal_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerPortalOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product", length = 100)
    private String product;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_portal_order_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "items"})
    private FarmerPortalOrder farmerPortalOrder;
}

