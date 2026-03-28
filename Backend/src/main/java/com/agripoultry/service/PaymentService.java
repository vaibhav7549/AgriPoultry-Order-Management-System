package com.agripoultry.service;

import com.agripoultry.dto.PaymentDto;
import com.agripoultry.entity.*;
import com.agripoultry.repository.FarmerPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final FarmerPaymentRepository farmerPaymentRepository;
    private final SaleService saleService;
    private final UserService userService;
    private final LedgerService ledgerService;

    /**
     * Farmer makes a payment toward a sale.
     * - Validates amount doesn't exceed due
     * - Updates sale's paidAmount, dueAmount, and status
     * - Records the payment
     * - Records CREDIT in ledger for farmer
     */
    @Transactional
    public PaymentDto.Response recordPayment(PaymentDto.Request req) {
        User farmer = userService.findOrThrow(req.getFarmerId());
        User distributor = userService.findOrThrow(req.getDistributorId());
        Sale sale = saleService.findSaleOrThrow(req.getSaleId());

        // Validate the payment belongs to the right farmer/distributor
        if (!sale.getFarmer().getUserId().equals(req.getFarmerId())) {
            throw new RuntimeException("This sale does not belong to farmer: " + req.getFarmerId());
        }
        if (!sale.getDistributor().getUserId().equals(req.getDistributorId())) {
            throw new RuntimeException("This sale does not belong to distributor: " + req.getDistributorId());
        }

        BigDecimal amountPaid = req.getAmountPaid();
        if (amountPaid.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Payment amount must be positive");
        }
        if (amountPaid.compareTo(sale.getDueAmount()) > 0) {
            throw new RuntimeException("Payment (" + amountPaid + ") exceeds due amount (" + sale.getDueAmount() + ")");
        }

        // Update sale financials
        BigDecimal newPaid = sale.getPaidAmount().add(amountPaid);
        BigDecimal newDue = sale.getTotalAmount().subtract(newPaid);

        sale.setPaidAmount(newPaid);
        sale.setDueAmount(newDue);

        // Update sale status
        if (newDue.compareTo(BigDecimal.ZERO) == 0) {
            sale.setStatus(Sale.SaleStatus.PAID);
        } else if (newPaid.compareTo(BigDecimal.ZERO) > 0) {
            sale.setStatus(Sale.SaleStatus.PARTIAL);
        }
        saleService.saveSale(sale);

        // Persist payment record
        FarmerPayment payment = FarmerPayment.builder()
                .farmer(farmer)
                .distributor(distributor)
                .sale(sale)
                .amountPaid(amountPaid)
                .paymentMethod(req.getPaymentMethod())
                .paymentDate(LocalDateTime.now())
                .remainingDue(newDue)
                .build();
        payment = farmerPaymentRepository.save(payment);

        // Ledger: CREDIT for farmer (they paid, debt reduces)
        ledgerService.recordCredit(farmer, amountPaid, Ledger.ReferenceType.PAYMENT, payment.getPaymentId());

        return buildResponse(payment);
    }

    public List<PaymentDto.Response> getPaymentsByFarmer(Integer farmerId) {
        return farmerPaymentRepository.findByFarmerUserId(farmerId)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    public List<PaymentDto.Response> getPaymentsByDistributor(Integer distributorId) {
        return farmerPaymentRepository.findByDistributorUserId(distributorId)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    public List<PaymentDto.Response> getPaymentsBySale(Integer saleId) {
        return farmerPaymentRepository.findBySaleSaleId(saleId)
                .stream().map(this::buildResponse).collect(Collectors.toList());
    }

    private PaymentDto.Response buildResponse(FarmerPayment p) {
        return PaymentDto.Response.builder()
                .paymentId(p.getPaymentId())
                .farmerId(p.getFarmer().getUserId())
                .farmerName(p.getFarmer().getName())
                .distributorId(p.getDistributor().getUserId())
                .saleId(p.getSale().getSaleId())
                .amountPaid(p.getAmountPaid())
                .paymentMethod(p.getPaymentMethod())
                .paymentDate(p.getPaymentDate())
                .remainingDue(p.getRemainingDue())
                .build();
    }
}