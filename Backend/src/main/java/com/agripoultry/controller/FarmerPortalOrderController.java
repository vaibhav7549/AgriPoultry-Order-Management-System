package com.agripoultry.controller;

import com.agripoultry.service.FarmerPortalOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/farmer-portal-orders")
@RequiredArgsConstructor
public class FarmerPortalOrderController {

    private final FarmerPortalOrderService service;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> get(
            @RequestParam(required = false) Integer distributorId,
            @RequestParam(required = false) Integer farmerId,
            @RequestParam(required = false) String farmerIdCode
    ) {
        if (distributorId != null) {
            return ResponseEntity.ok(service.getByDistributor(distributorId));
        }
        if (farmerId != null) {
            String farmerCode = "F" + String.format("%03d", farmerId);
            return ResponseEntity.ok(service.getByFarmer(farmerCode));
        }
        if (farmerIdCode != null && !farmerIdCode.isBlank()) {
            return ResponseEntity.ok(service.getByFarmer(farmerIdCode));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(service.create(data));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(service.updateStatus(orderId, body.get("status")));
    }
}
