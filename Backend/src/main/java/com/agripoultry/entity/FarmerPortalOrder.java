package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "farmer_portal_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerPortalOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dbId;

    @Column(name = "order_id", unique = true, length = 20)
    private String orderId;

    @Column(name = "farmer_id_code", length = 20)
    private String farmerIdCode;

    @Column(name = "product", length = 100)
    private String product;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "order_date", length = 20)
    private String date;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "delivered_date", length = 20)
    private String deliveredDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "farmerPortalOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private List<FarmerPortalOrderItem> items;
}
