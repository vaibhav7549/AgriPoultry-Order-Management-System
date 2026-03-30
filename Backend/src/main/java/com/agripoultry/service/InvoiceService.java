package com.agripoultry.service;

import com.agripoultry.entity.Invoice;
import com.agripoultry.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository repo;

    public List<Map<String, Object>> getAll() {
        return repo.findAllByOrderByDateDesc().stream().map(this::toMap).toList();
    }

    private Map<String, Object> toMap(Invoice inv) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", inv.getInvoiceId());
        m.put("date", inv.getDate());
        m.put("amount", inv.getAmount() != null ? inv.getAmount().intValue() : 0);
        m.put("status", inv.getStatus());
        m.put("orderId", inv.getOrderId());
        return m;
    }
}
