package com.agripoultry.service;

import com.agripoultry.dto.PurchaseDto;
import com.agripoultry.entity.*;
import com.agripoultry.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserService userService;
    private final LedgerService ledgerService;

    /**
     * Distributor places a bulk purchase order to a company.
     * - Validates roles
     * - Calculates due = total - paid
     * - Records DEBIT in ledger for distributor (they owe the company)
     * - Records CREDIT in ledger for company (they are owed money)
     */
    @Transactional
    public PurchaseDto.Response createPurchase(PurchaseDto.Request req) {
        User distributor = userService.findOrThrow(req.getDistributorId());
        User company = userService.findOrThrow(req.getCompanyId());

        if (distributor.getRole() != User.Role.DISTRIBUTOR) {
            throw new RuntimeException("User " + req.getDistributorId() + " is not a DISTRIBUTOR");
        }
        if (company.getRole() != User.Role.COMPANY) {
            throw new RuntimeException("User " + req.getCompanyId() + " is not a COMPANY");
        }

        BigDecimal paid = req.getPaidAmount() != null ? req.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal due = req.getTotalAmount().subtract(paid);

        if (due.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Paid amount cannot exceed total amount");
        }

        Purchase purchase = Purchase.builder()
                .distributor(distributor)
                .company(company)
                .totalAmount(req.getTotalAmount())
                .paidAmount(paid)
                .dueAmount(due)
                .build();
        purchase = purchaseRepository.save(purchase);

        // Ledger: distributor DEBITS (owes company)
        ledgerService.recordDebit(distributor, due, Ledger.ReferenceType.PURCHASE, purchase.getPurchaseId());

        return buildResponse(purchase);
    }

    /**
     * Distributor makes a payment toward a purchase.
     */
    @Transactional
    public PurchaseDto.Response recordPurchasePayment(Integer purchaseId, BigDecimal amount) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new RuntimeException("Purchase not found: " + purchaseId));

        if (amount.compareTo(purchase.getDueAmount()) > 0) {
            throw new RuntimeException("Payment exceeds due amount");
        }

        purchase.setPaidAmount(purchase.getPaidAmount().add(amount));
        purchase.setDueAmount(purchase.getDueAmount().subtract(amount));
        purchase = purchaseRepository.save(purchase);

        // Ledger: distributor CREDIT (debt reduces)
        ledgerService.recordCredit(
                purchase.getDistributor(), amount,
                Ledger.ReferenceType.PAYMENT, purchaseId
        );

        return buildResponse(purchase);
    }

    public List<PurchaseDto.Response> getPurchasesByDistributor(Integer distributorId) {
        return purchaseRepository.findByDistributorUserId(distributorId)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    public List<PurchaseDto.Response> getPurchasesByCompany(Integer companyId) {
        return purchaseRepository.findByCompanyUserId(companyId)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    public BigDecimal getTotalDueDistributorToCompany(Integer distributorId, Integer companyId) {
        return purchaseRepository.totalDueByDistributorToCompany(distributorId, companyId);
    }

    public PurchaseDto.Response getPurchaseById(Integer id) {
        return buildResponse(purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found: " + id)));
    }

    private PurchaseDto.Response buildResponse(Purchase p) {
        return PurchaseDto.Response.builder()
                .purchaseId(p.getPurchaseId())
                .distributorId(p.getDistributor().getUserId())
                .distributorName(p.getDistributor().getName())
                .companyId(p.getCompany().getUserId())
                .companyName(p.getCompany().getName())
                .totalAmount(p.getTotalAmount())
                .paidAmount(p.getPaidAmount())
                .dueAmount(p.getDueAmount())
                .build();
    }
}