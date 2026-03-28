package com.agripoultry.controller;

import com.agripoultry.dto.PurchaseDto;
import com.agripoultry.service.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;

    /**
     * POST /api/purchases
     * Distributor places a bulk purchase order to company.
     * Body: { distributorId, companyId, totalAmount, paidAmount }
     */
    @PostMapping
    public ResponseEntity<PurchaseDto.Response> createPurchase(
            @RequestBody PurchaseDto.Request req) {
        return ResponseEntity.ok(purchaseService.createPurchase(req));
    }

    // GET /api/purchases/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseDto.Response> getPurchase(@PathVariable Integer id) {
        return ResponseEntity.ok(purchaseService.getPurchaseById(id));
    }

    // GET /api/purchases?distributorId=2  → all purchases by a distributor
    // GET /api/purchases?companyId=3      → all purchases to a company
    @GetMapping
    public ResponseEntity<List<PurchaseDto.Response>> getPurchases(
            @RequestParam(required = false) Integer distributorId,
            @RequestParam(required = false) Integer companyId) {

        if (distributorId != null) return ResponseEntity.ok(purchaseService.getPurchasesByDistributor(distributorId));
        if (companyId != null) return ResponseEntity.ok(purchaseService.getPurchasesByCompany(companyId));

        return ResponseEntity.badRequest().build();
    }

    /**
     * PATCH /api/purchases/{id}/pay
     * Distributor pays toward a purchase.
     * Body: { "amount": 5000.00 }
     */
    @PatchMapping("/{id}/pay")
    public ResponseEntity<PurchaseDto.Response> payPurchase(
            @PathVariable Integer id,
            @RequestBody Map<String, BigDecimal> body) {
        BigDecimal amount = body.get("amount");
        if (amount == null) {
            throw new RuntimeException("'amount' field is required");
        }
        return ResponseEntity.ok(purchaseService.recordPurchasePayment(id, amount));
    }

    // GET /api/purchases/dues?distributorId=2&companyId=3
    @GetMapping("/dues")
    public ResponseEntity<BigDecimal> getDue(
            @RequestParam Integer distributorId,
            @RequestParam Integer companyId) {
        return ResponseEntity.ok(purchaseService.getTotalDueDistributorToCompany(distributorId, companyId));
    }
}