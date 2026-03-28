package com.agripoultry.service;

import com.agripoultry.dto.SaleDto;
import com.agripoultry.entity.*;
import com.agripoultry.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final LedgerService ledgerService;

    /**
     * Farmer places an order (or distributor creates a sale on behalf of farmer).
     * - Calculates subtotals from manually entered price × quantity
     * - Saves the sale + line items
     * - Creates a DEBIT ledger entry for the farmer (they owe money)
     */
    @Transactional
    public SaleDto.Response createSale(SaleDto.Request req) {
        User farmer = userService.findOrThrow(req.getFarmerId());
        User distributor = userService.findOrThrow(req.getDistributorId());

        if (farmer.getRole() != User.Role.FARMER) {
            throw new RuntimeException("User " + req.getFarmerId() + " is not a FARMER");
        }
        if (distributor.getRole() != User.Role.DISTRIBUTOR) {
            throw new RuntimeException("User " + req.getDistributorId() + " is not a DISTRIBUTOR");
        }

        // Calculate total from line items
        BigDecimal total = BigDecimal.ZERO;
        List<SaleItem> itemsToSave = new ArrayList<>();

        for (SaleDto.ItemRequest itemReq : req.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            BigDecimal subtotal = itemReq.getPrice()
                    .multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            total = total.add(subtotal);

            itemsToSave.add(SaleItem.builder()
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(itemReq.getPrice())
                    .subtotal(subtotal)
                    .build());
        }

        // Save Sale first (items need sale reference)
        Sale sale = Sale.builder()
                .farmer(farmer)
                .distributor(distributor)
                .totalAmount(total)
                .paidAmount(BigDecimal.ZERO)
                .dueAmount(total)
                .status(Sale.SaleStatus.UNPAID)
                .saleDate(LocalDateTime.now())
                .build();
        sale = saleRepository.save(sale);

        // Link items to saved sale and persist
        final Sale savedSale = sale;
        itemsToSave.forEach(item -> item.setSale(savedSale));
        List<SaleItem> savedItems = saleItemRepository.saveAll(itemsToSave);
        savedSale.setSaleItems(savedItems);

        // Ledger: farmer goes into DEBIT (owes distributor)
        ledgerService.recordDebit(farmer, total, Ledger.ReferenceType.SALE, savedSale.getSaleId());

        return buildResponse(savedSale, savedItems);
    }

    public SaleDto.Response getSaleById(Integer saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + saleId));
        List<SaleItem> items = saleItemRepository.findBySaleSaleId(saleId);
        return buildResponse(sale, items);
    }

    public List<SaleDto.Response> getSalesByFarmer(Integer farmerId) {
        return saleRepository.findByFarmerUserId(farmerId).stream()
                .map(sale -> buildResponse(sale, saleItemRepository.findBySaleSaleId(sale.getSaleId())))
                .collect(Collectors.toList());
    }

    public List<SaleDto.Response> getSalesByDistributor(Integer distributorId) {
        return saleRepository.findByDistributorUserId(distributorId).stream()
                .map(sale -> buildResponse(sale, saleItemRepository.findBySaleSaleId(sale.getSaleId())))
                .collect(Collectors.toList());
    }

    public List<SaleDto.Response> getPendingDuesByFarmer(Integer farmerId) {
        return saleRepository.findByFarmerUserIdAndStatusIn(
                        farmerId,
                        List.of(Sale.SaleStatus.UNPAID, Sale.SaleStatus.PARTIAL)
                ).stream()
                .map(sale -> buildResponse(sale, saleItemRepository.findBySaleSaleId(sale.getSaleId())))
                .collect(Collectors.toList());
    }

    public List<SaleDto.Response> getPendingDuesByDistributor(Integer distributorId) {
        return saleRepository.findByDistributorUserIdAndStatusIn(
                        distributorId,
                        List.of(Sale.SaleStatus.UNPAID, Sale.SaleStatus.PARTIAL)
                ).stream()
                .map(sale -> buildResponse(sale, saleItemRepository.findBySaleSaleId(sale.getSaleId())))
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalDueFarmerToDistributor(Integer farmerId, Integer distributorId) {
        return saleRepository.totalDueByFarmerToDistributor(farmerId, distributorId);
    }

    // Package-private: used by PaymentService to update sale after payment
    Sale findSaleOrThrow(Integer saleId) {
        return saleRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + saleId));
    }

    Sale saveSale(Sale sale) {
        return saleRepository.save(sale);
    }

    // ─── Private Helpers ───────────────────────────────────────────────────────

    private SaleDto.Response buildResponse(Sale sale, List<SaleItem> items) {
        List<SaleDto.SaleItemResponse> itemResponses = items.stream()
                .map(i -> SaleDto.SaleItemResponse.builder()
                        .saleItemId(i.getSaleItemId())
                        .productId(i.getProduct().getProductId())
                        .productName(i.getProduct().getProductName())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .subtotal(i.getSubtotal())
                        .build())
                .collect(Collectors.toList());

        return SaleDto.Response.builder()
                .saleId(sale.getSaleId())
                .farmerId(sale.getFarmer().getUserId())
                .farmerName(sale.getFarmer().getName())
                .distributorId(sale.getDistributor().getUserId())
                .distributorName(sale.getDistributor().getName())
                .totalAmount(sale.getTotalAmount())
                .paidAmount(sale.getPaidAmount())
                .dueAmount(sale.getDueAmount())
                .status(sale.getStatus())
                .saleDate(sale.getSaleDate())
                .items(itemResponses)
                .build();
    }
}