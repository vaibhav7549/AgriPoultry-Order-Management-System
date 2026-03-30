package com.agripoultry.controller;

import com.agripoultry.service.FarmerOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/farmer-orders")
@RequiredArgsConstructor
public class FarmerOrderController {

    private final FarmerOrderService service;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(@RequestParam(required = false) Integer distributorId) {
        if (distributorId != null) {
            return ResponseEntity.ok(service.getByDistributor(distributorId));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Map<String, Object> data,
            @RequestParam Integer distributorId) {
        return ResponseEntity.ok(service.create(data, distributorId));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(orderId, body.get("status")));
    }
}
