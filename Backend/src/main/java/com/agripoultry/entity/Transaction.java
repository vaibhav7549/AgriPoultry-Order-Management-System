package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer dbId;

    @Column(name = "txn_id", unique = true, length = 20)
    private String txnId;

    @Column(name = "txn_date", length = 20)
    private String date;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "credit", precision = 12, scale = 2)
    private BigDecimal credit;

    @Column(name = "debit", precision = 12, scale = 2)
    private BigDecimal debit;

    @Column(name = "balance", precision = 12, scale = 2)
    private BigDecimal balance;

    @Column(name = "txn_type", length = 30)
    private String type;

    @Column(name = "user_id_code", length = 20)
    private String userIdCode;
}
