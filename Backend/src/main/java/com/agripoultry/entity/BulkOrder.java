package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "bulk_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BulkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "order_id", unique = true, length = 20)
    private String orderId;

    @Column(name = "distributor_id_code", length = 20)
    private String distributorIdCode;

    @Column(name = "distributor_name", length = 150)
    private String distributorName;

    @Column(name = "total_value", precision = 12, scale = 2)
    private BigDecimal totalValue;

    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "order_date", length = 20)
    private String date;

    @Column(name = "contact", length = 20)
    private String contact;

    @OneToMany(mappedBy = "bulkOrder", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("bulkOrder")
    private List<BulkOrderItem> items;
}
