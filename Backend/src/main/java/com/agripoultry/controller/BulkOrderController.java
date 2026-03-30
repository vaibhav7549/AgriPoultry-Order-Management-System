package com.agripoultry.controller;

import com.agripoultry.service.BulkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/bulk-orders")
@RequiredArgsConstructor
public class BulkOrderController {

    private final BulkOrderService service;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(required = false) String distributorId) {
        if (distributorId != null) {
            return ResponseEntity.ok(service.getByDistributor(distributorId));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(service.create(data));
    }

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateStatus(orderId, body.get("status")));
    }
}
