package com.agripoultry.controller;

import com.agripoultry.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(service.getByUser(userId));
        }
        return ResponseEntity.ok(service.getAll());
    }
}
