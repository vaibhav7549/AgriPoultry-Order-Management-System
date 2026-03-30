package com.agripoultry.service;

import com.agripoultry.dto.PurchaseDto;
import com.agripoultry.entity.BulkOrder;
import com.agripoultry.entity.BulkOrderItem;
import com.agripoultry.entity.User;
import com.agripoultry.repository.BulkOrderRepository;
import com.agripoultry.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BulkOrderService {

    private final BulkOrderRepository repo;
    private final UserRepository userRepository;
    private final PurchaseService purchaseService;

    public List<Map<String, Object>> getAll() {
        return repo.findAllByOrderByDateDesc().stream().map(this::toMap).toList();
    }

    public List<Map<String, Object>> getByDistributor(String distributorIdCode) {
        return repo.findByDistributorIdCodeOrderByDateDesc(distributorIdCode).stream().map(this::toMap).toList();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> create(Map<String, Object> data) {
        long count = repo.count();
        List<Map<String, Object>> itemsList = (List<Map<String, Object>>) data.getOrDefault("items", Collections.emptyList());

        // Bulk order is always sent to a company. Pick the first COMPANY user in the DB.
        List<User> companies = userRepository.findByRole(User.Role.COMPANY);
        if (companies.isEmpty()) {
            throw new RuntimeException("No COMPANY user found in DB.");
        }
        User company = companies.get(0);

        String distributorIdCode = (String) data.get("distributorId");
        Integer distributorDbId = Integer.parseInt(
                distributorIdCode != null ? distributorIdCode.replaceAll("\\D", "") : "0"
        );
        User distributor = userRepository.findById(distributorDbId)
                .orElseThrow(() -> new RuntimeException("Distributor not found: " + distributorDbId));

        BulkOrder order = BulkOrder.builder()
                .orderId("BO-" + (2001 + count))
                .distributorIdCode(distributorIdCode)
                .distributorName((String) data.get("distributorName"))
                .totalValue(BigDecimal.valueOf(((Number) data.get("totalValue")).doubleValue()))
                .status("New Orders")
                .date(LocalDate.now().toString())
                .contact((String) data.get("contact"))
                .companyId(company.getUserId())
                .companyName(company.getName())
                .build();

        List<BulkOrderItem> items = new ArrayList<>();
        for (Map<String, Object> item : itemsList) {
            items.add(BulkOrderItem.builder()
                    .product((String) item.get("product"))
                    .qty(((Number) item.get("qty")).intValue())
                    .price(BigDecimal.valueOf(((Number) item.get("price")).doubleValue()))
                    .bulkOrder(order)
                    .build());
        }
        order.setItems(items);
        repo.save(order);

        // Create a corresponding Purchase so Ledger + Distributor/Company ledger pages stay in sync.
        PurchaseDto.Request purchaseReq = PurchaseDto.Request.builder()
                .distributorId(distributor.getUserId())
                .companyId(company.getUserId())
                .bulkOrderId(order.getOrderId())
                .totalAmount(order.getTotalValue())
                .paidAmount(BigDecimal.ZERO)
                .build();
        purchaseService.createPurchase(purchaseReq);

        return toMap(order);
    }

    public Map<String, Object> updateStatus(String orderId, String status) {
        BulkOrder order = repo.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Bulk order not found: " + orderId));
        order.setStatus(status);
        repo.save(order);
        return toMap(order);
    }

    private Map<String, Object> toMap(BulkOrder o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getOrderId());
        m.put("distributorId", o.getDistributorIdCode());
        m.put("distributorName", o.getDistributorName());
        m.put("totalValue", o.getTotalValue() != null ? o.getTotalValue().intValue() : 0);
        m.put("status", o.getStatus());
        m.put("date", o.getDate());
        m.put("contact", o.getContact());
        List<Map<String, Object>> items = new ArrayList<>();
        if (o.getItems() != null) {
            for (BulkOrderItem item : o.getItems()) {
                Map<String, Object> im = new LinkedHashMap<>();
                im.put("product", item.getProduct());
                im.put("qty", item.getQty());
                im.put("price", item.getPrice() != null ? item.getPrice().intValue() : 0);
                items.add(im);
            }
        }
        m.put("items", items);
        return m;
    }
}
