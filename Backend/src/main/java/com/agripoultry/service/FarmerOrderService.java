package com.agripoultry.service;

import com.agripoultry.entity.FarmerOrder;
import com.agripoultry.repository.FarmerOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FarmerOrderService {

    private final FarmerOrderRepository repo;

    public List<Map<String, Object>> getAll() {
        return repo.findAllByOrderByDateDesc().stream().map(this::toMap).toList();
    }

    public List<Map<String, Object>> getByDistributor(Integer distributorId) {
        return repo.findByDistributorUserIdOrderByDateDesc(distributorId).stream().map(this::toMap).toList();
    }

    public Map<String, Object> create(Map<String, Object> data, Integer distributorId) {
        long count = repo.countByDistributorUserId(distributorId);
        FarmerOrder order = FarmerOrder.builder()
                .orderId("FO-" + (1001 + count))
                .farmerIdCode((String) data.get("farmerId"))
                .farmerName((String) data.get("farmerName"))
                .farmerPhone((String) data.get("farmerPhone"))
                .product((String) data.get("product"))
                .qty(((Number) data.get("qty")).intValue())
                .unitPrice(BigDecimal.valueOf(((Number) data.get("unitPrice")).doubleValue()))
                .amount(BigDecimal.valueOf(((Number) data.get("amount")).doubleValue()))
                .status("Pending")
                .date(LocalDate.now().toString())
                .notes((String) data.get("notes"))
                .build();
        // Set distributor via a proxy object
        com.agripoultry.entity.User distProxy = new com.agripoultry.entity.User();
        distProxy.setUserId(distributorId);
        order.setDistributor(distProxy);
        repo.save(order);
        return toMap(order);
    }

    public Map<String, Object> updateStatus(String orderId, String status) {
        FarmerOrder order = repo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        repo.save(order);
        return toMap(order);
    }

    private Map<String, Object> toMap(FarmerOrder o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getOrderId());
        m.put("farmerId", o.getFarmerIdCode());
        m.put("farmerName", o.getFarmerName());
        m.put("farmerPhone", o.getFarmerPhone());
        m.put("product", o.getProduct());
        m.put("qty", o.getQty());
        m.put("unitPrice", o.getUnitPrice() != null ? o.getUnitPrice().intValue() : 0);
        m.put("amount", o.getAmount() != null ? o.getAmount().intValue() : 0);
        m.put("status", o.getStatus());
        m.put("date", o.getDate());
        m.put("notes", o.getNotes());
        return m;
    }
}
