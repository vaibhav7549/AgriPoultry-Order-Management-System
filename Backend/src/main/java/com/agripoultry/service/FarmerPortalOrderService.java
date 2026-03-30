package com.agripoultry.service;

import com.agripoultry.entity.FarmerPortalOrder;
import com.agripoultry.entity.FarmerPortalOrderItem;
import com.agripoultry.entity.User;
import com.agripoultry.repository.UserRepository;
import com.agripoultry.repository.FarmerPortalOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FarmerPortalOrderService {

    private final FarmerPortalOrderRepository repo;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getByFarmer(String farmerIdCode) {
        return repo.findByFarmerIdCodeOrderByDateDesc(farmerIdCode).stream().map(this::toMap).toList();
    }

    public List<Map<String, Object>> getByDistributor(Integer distributorUserId) {
        List<User> farmers = userRepository.findByAssignedDistributorUserId(distributorUserId);
        Set<String> farmerCodes = farmers.stream()
                .map(f -> "F" + String.format("%03d", f.getUserId()))
                .collect(java.util.stream.Collectors.toSet());

        return repo.findAll().stream()
                .filter(o -> o.getFarmerIdCode() != null && farmerCodes.contains(o.getFarmerIdCode()))
                .sorted(Comparator.comparing(FarmerPortalOrder::getDate,
                        Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toMap)
                .toList();
    }

    public Map<String, Object> updateStatus(String orderId, String status) {
        FarmerPortalOrder order = repo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus(status);
        if (status != null && status.equalsIgnoreCase("Delivered")) {
            order.setDeliveredDate(LocalDate.now().toString());
        } else {
            order.setDeliveredDate(null);
        }

        repo.save(order);
        return toMap(order);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> create(Map<String, Object> data) {
        long count = repo.count();
        List<Map<String, Object>> itemsList = (List<Map<String, Object>>) data.getOrDefault("items", Collections.emptyList());
        double totalValue = data.get("totalValue") != null ? ((Number) data.get("totalValue")).doubleValue() : 0;

        // One cart = one orderId (multiple items stored as FarmerPortalOrderItem rows).
        String orderId = "FPO-" + (3001 + count);
        String farmerIdCode = (String) data.get("farmerId");
        String dateStr = LocalDate.now().toString();

        String firstProduct = itemsList.isEmpty() ? "" : (String) itemsList.get(0).get("product");
        Integer firstQty = itemsList.isEmpty() ? 0 : ((Number) itemsList.get(0).get("qty")).intValue();
        BigDecimal firstUnitPrice = itemsList.isEmpty()
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(((Number) itemsList.get(0).get("price")).doubleValue());

        FarmerPortalOrder order = FarmerPortalOrder.builder()
                .orderId(orderId)
                .farmerIdCode(farmerIdCode)
                .product(firstProduct)
                .qty(firstQty)
                .unitPrice(firstUnitPrice)
                .amount(BigDecimal.valueOf(totalValue))
                .date(dateStr)
                .status("Pending")
                .build();

        // Persist cart items
        List<FarmerPortalOrderItem> items = new ArrayList<>();
        for (Map<String, Object> item : itemsList) {
            if (item == null) continue;
            String product = (String) item.get("product");
            Integer qty = item.get("qty") != null ? ((Number) item.get("qty")).intValue() : 0;
            BigDecimal price = item.get("price") != null ? BigDecimal.valueOf(((Number) item.get("price")).doubleValue()) : BigDecimal.ZERO;

            items.add(FarmerPortalOrderItem.builder()
                    .product(product)
                    .qty(qty)
                    .unitPrice(price)
                    .farmerPortalOrder(order)
                    .build());
        }
        order.setItems(items);
        repo.save(order);

        // Return in the frontend-expected shape (with items array + compatibility fields)
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", orderId);
        result.put("farmerId", farmerIdCode);
        result.put("date", dateStr);
        result.put("items", itemsList);
        result.put("product", firstProduct);
        result.put("qty", firstQty);
        result.put("unitPrice", firstUnitPrice.intValue());
        result.put("amount", totalValue);
        result.put("totalValue", (int) totalValue);
        result.put("status", "Pending");
        return result;
    }

    private Map<String, Object> toMap(FarmerPortalOrder o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getOrderId());
        m.put("farmerId", o.getFarmerIdCode());

        // Add farmer contact details for distributor portal UI.
        try {
            String digits = o.getFarmerIdCode() != null ? o.getFarmerIdCode().replaceAll("\\D", "") : "";
            if (!digits.isEmpty()) {
                int farmerUserId = Integer.parseInt(digits);
                userRepository.findById(farmerUserId).ifPresent(f -> {
                    m.put("farmerName", f.getName());
                    m.put("farmerPhone", f.getPhone());
                });
            }
        } catch (Exception ignored) {}

        m.put("date", o.getDate());

        // Build items array from persisted items (fallback to compatibility fields).
        List<Map<String, Object>> items = new ArrayList<>();
        if (o.getItems() != null && !o.getItems().isEmpty()) {
            for (FarmerPortalOrderItem item : o.getItems()) {
                if (item == null) continue;
                Map<String, Object> im = new LinkedHashMap<>();
                im.put("product", item.getProduct());
                im.put("qty", item.getQty());
                im.put("price", item.getUnitPrice() != null ? item.getUnitPrice().intValue() : 0);
                items.add(im);
            }
        } else if (o.getProduct() != null && !o.getProduct().isEmpty()) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("product", o.getProduct());
            item.put("qty", o.getQty());
            item.put("price", o.getUnitPrice() != null ? o.getUnitPrice().intValue() : 0);
            items.add(item);
        }
        m.put("items", items);

        String firstProduct = (items.isEmpty() ? o.getProduct() : (String) items.get(0).get("product"));
        Integer firstQty = (items.isEmpty() ? o.getQty() : ((Number) items.get(0).get("qty")).intValue());
        int firstUnitPrice = (items.isEmpty() ? (o.getUnitPrice() != null ? o.getUnitPrice().intValue() : 0) : ((Number) items.get(0).get("price")).intValue());

        m.put("product", firstProduct);
        m.put("qty", firstQty);
        m.put("unitPrice", firstUnitPrice);
        m.put("amount", o.getAmount() != null ? o.getAmount().intValue() : 0);
        m.put("totalValue", o.getAmount() != null ? o.getAmount().intValue() : 0);
        m.put("status", o.getStatus());
        m.put("deliveredDate", o.getDeliveredDate());
        m.put("notes", o.getNotes());
        return m;
    }
}
