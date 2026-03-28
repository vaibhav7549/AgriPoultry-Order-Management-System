package com.agripoultry.controller;

import com.agripoultry.dto.PaymentDto;
import com.agripoultry.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/payments
     * Farmer makes a payment toward a sale.
     * Body: { farmerId, distributorId, saleId, amountPaid, paymentMethod }
     */
    @PostMapping
    public ResponseEntity<PaymentDto.Response> recordPayment(
            @Valid @RequestBody PaymentDto.Request req) {
        return ResponseEntity.ok(paymentService.recordPayment(req));
    }

    // GET /api/payments?farmerId=1
    // GET /api/payments?distributorId=2
    // GET /api/payments?saleId=5
    @GetMapping
    public ResponseEntity<List<PaymentDto.Response>> getPayments(
            @RequestParam(required = false) Integer farmerId,
            @RequestParam(required = false) Integer distributorId,
            @RequestParam(required = false) Integer saleId) {

        if (farmerId != null) return ResponseEntity.ok(paymentService.getPaymentsByFarmer(farmerId));
        if (distributorId != null) return ResponseEntity.ok(paymentService.getPaymentsByDistributor(distributorId));
        if (saleId != null) return ResponseEntity.ok(paymentService.getPaymentsBySale(saleId));

        return ResponseEntity.badRequest().build();
    }
}