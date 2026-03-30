package com.agripoultry.dto;

import lombok.*;
import java.math.BigDecimal;

public class PurchaseDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        private Integer distributorId;
        private Integer companyId;
        private String bulkOrderId;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer purchaseId;
        private Integer distributorId;
        private String distributorName;
        private Integer companyId;
        private String companyName;
        private String bulkOrderId;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal dueAmount;
    }
}