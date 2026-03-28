package com.agripoultry.controller;

import com.agripoultry.entity.Ledger;
import com.agripoultry.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    // GET /api/ledger/{userId}  → full transaction history for any user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Ledger>> getLedger(@PathVariable Integer userId) {
        return ResponseEntity.ok(ledgerService.getLedgerForUser(userId));
    }

    // GET /api/ledger/{userId}/balance  → current outstanding balance
    @GetMapping("/{userId}/balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable Integer userId) {
        return ResponseEntity.ok(ledgerService.getCurrentBalance(userId));
    }
}