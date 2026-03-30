package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "bulk_order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product", length = 100)
    private String product;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bulk_order_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "items"})
    private BulkOrder bulkOrder;
}
