package com.agripoultry.dto;

import com.agripoultry.entity.FarmerPayment;
import lombok.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotNull private Integer farmerId;
        @NotNull private Integer distributorId;
        @NotNull private Integer saleId;
        @NotNull private BigDecimal amountPaid;
        @NotNull private FarmerPayment.PaymentMethod paymentMethod;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer paymentId;
        private Integer farmerId;
        private String farmerName;
        private Integer distributorId;
        private Integer saleId;
        private BigDecimal amountPaid;
        private FarmerPayment.PaymentMethod paymentMethod;
        private LocalDateTime paymentDate;
        private BigDecimal remainingDue;
    }
}