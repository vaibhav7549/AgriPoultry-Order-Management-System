package com.agripoultry.dto;

import com.agripoultry.entity.Sale;
import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class SaleDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ItemRequest {
        @NotNull private Integer productId;
        @NotNull @Min(1) private Integer quantity;
        @NotNull private BigDecimal price;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotNull private Integer farmerId;
        @NotNull private Integer distributorId;
        @NotNull @Size(min = 1) private List<ItemRequest> items;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer saleId;
        private Integer farmerId;
        private String farmerName;
        private Integer distributorId;
        private String distributorName;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal dueAmount;
        private Sale.SaleStatus status;
        private LocalDateTime saleDate;
        private List<SaleItemResponse> items;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SaleItemResponse {
        private Integer saleItemId;
        private Integer productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
    }
}