package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "farmer_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", unique = true, length = 20)
    private String orderId;

    @Column(name = "farmer_id_code", length = 20)
    private String farmerIdCode;

    @Column(name = "farmer_name", length = 100)
    private String farmerName;

    @Column(name = "farmer_phone", length = 15)
    private String farmerPhone;

    @Column(name = "product", length = 100)
    private String product;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "amount", precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "order_date", length = 20)
    private String date;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "distributor_user_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User distributor;
}
