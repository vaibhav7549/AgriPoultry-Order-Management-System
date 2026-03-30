package com.agripoultry.controller;

import com.agripoultry.entity.Ledger;
import com.agripoultry.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    // GET /api/ledger/{userId}  → full transaction history for any user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getLedger(@PathVariable Integer userId) {
        return ResponseEntity.ok(
                ledgerService.getLedgerForUser(userId).stream().map(this::toMap).toList()
        );
    }

    // GET /api/ledger/{userId}/balance  → current outstanding balance
    @GetMapping("/{userId}/balance")
    public ResponseEntity<BigDecimal> getBalance(@PathVariable Integer userId) {
        return ResponseEntity.ok(ledgerService.getCurrentBalance(userId));
    }

    private Map<String, Object> toMap(Ledger l) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("ledgerId", l.getLedgerId());
        m.put("date", l.getDate());
        m.put("type", l.getType());
        m.put("referenceType", l.getReferenceType());
        m.put("referenceId", l.getReferenceId());
        m.put("amount", l.getAmount());
        m.put("balance", l.getBalance());
        return m;
    }
}