package com.agripoultry.controller;

import com.agripoultry.dto.SaleDto;
import com.agripoultry.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    /**
     * POST /api/sales
     * Farmer places an order.
     * Body: { farmerId, distributorId, items: [{productId, quantity, price}] }
     */
    @PostMapping
    public ResponseEntity<SaleDto.Response> createSale(
            @Valid @RequestBody SaleDto.Request req) {
        return ResponseEntity.ok(saleService.createSale(req));
    }

    // GET /api/sales/{id}
    @GetMapping("/{id}")
    public ResponseEntity<SaleDto.Response> getSale(@PathVariable Integer id) {
        return ResponseEntity.ok(saleService.getSaleById(id));
    }

    // GET /api/sales?farmerId=1  → all sales for a farmer
    // GET /api/sales?distributorId=2  → all sales for a distributor
    @GetMapping
    public ResponseEntity<List<SaleDto.Response>> getSales(
            @RequestParam(required = false) Integer farmerId,
            @RequestParam(required = false) Integer distributorId) {

        if (farmerId != null) {
            return ResponseEntity.ok(saleService.getSalesByFarmer(farmerId));
        }
        if (distributorId != null) {
            return ResponseEntity.ok(saleService.getSalesByDistributor(distributorId));
        }
        return ResponseEntity.badRequest().build();
    }

    // GET /api/sales/dues/farmer/{farmerId}  → all unpaid/partial sales for farmer
    @GetMapping("/dues/farmer/{farmerId}")
    public ResponseEntity<List<SaleDto.Response>> getFarmerDues(@PathVariable Integer farmerId) {
        return ResponseEntity.ok(saleService.getPendingDuesByFarmer(farmerId));
    }

    // GET /api/sales/dues/distributor/{distributorId}  → what all farmers owe this distributor
    @GetMapping("/dues/distributor/{distributorId}")
    public ResponseEntity<List<SaleDto.Response>> getDistributorDues(@PathVariable Integer distributorId) {
        return ResponseEntity.ok(saleService.getPendingDuesByDistributor(distributorId));
    }

    // GET /api/sales/dues?farmerId=1&distributorId=2  → total due amount between a farmer and distributor
    @GetMapping("/dues")
    public ResponseEntity<BigDecimal> getDueBetween(
            @RequestParam Integer farmerId,
            @RequestParam Integer distributorId) {
        return ResponseEntity.ok(saleService.getTotalDueFarmerToDistributor(farmerId, distributorId));
    }
}