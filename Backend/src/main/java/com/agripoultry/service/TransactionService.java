package com.agripoultry.service;

import com.agripoultry.entity.Transaction;
import com.agripoultry.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repo;

    public List<Map<String, Object>> getByUser(String userIdCode) {
        return repo.findByUserIdCodeOrderByDateDesc(userIdCode).stream().map(this::toMap).toList();
    }

    public List<Map<String, Object>> getAll() {
        return repo.findAllByOrderByDateDesc().stream().map(this::toMap).toList();
    }

    private Map<String, Object> toMap(Transaction t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", t.getTxnId());
        m.put("date", t.getDate());
        m.put("description", t.getDescription());
        m.put("credit", t.getCredit() != null ? t.getCredit().intValue() : 0);
        m.put("debit", t.getDebit() != null ? t.getDebit().intValue() : 0);
        m.put("balance", t.getBalance() != null ? t.getBalance().intValue() : 0);
        m.put("type", t.getType());
        return m;
    }
}
