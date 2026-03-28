package com.agripoultry.service;

import com.agripoultry.entity.Ledger;
import com.agripoultry.entity.User;
import com.agripoultry.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    /**
     * Record a DEBIT entry (money the user owes / has to pay)
     * e.g. farmer gets goods on credit → DEBIT for farmer
     *      distributor places bulk purchase → DEBIT for distributor
     */
    public Ledger recordDebit(User user, BigDecimal amount,
                              Ledger.ReferenceType refType, Integer refId) {
        BigDecimal currentBalance = ledgerRepository.getLatestBalance(user.getUserId());
        BigDecimal newBalance = currentBalance.add(amount); // debt increases balance

        return ledgerRepository.save(Ledger.builder()
                .user(user)
                .type(Ledger.LedgerType.DEBIT)
                .referenceType(refType)
                .referenceId(refId)
                .amount(amount)
                .balance(newBalance)
                .date(LocalDateTime.now())
                .build());
    }

    /**
     * Record a CREDIT entry (money received / payment made)
     * e.g. farmer pays → CREDIT for farmer
     *      distributor pays company → CREDIT for distributor
     */
    public Ledger recordCredit(User user, BigDecimal amount,
                               Ledger.ReferenceType refType, Integer refId) {
        BigDecimal currentBalance = ledgerRepository.getLatestBalance(user.getUserId());
        BigDecimal newBalance = currentBalance.subtract(amount); // debt decreases

        return ledgerRepository.save(Ledger.builder()
                .user(user)
                .type(Ledger.LedgerType.CREDIT)
                .referenceType(refType)
                .referenceId(refId)
                .amount(amount)
                .balance(newBalance)
                .date(LocalDateTime.now())
                .build());
    }

    public List<Ledger> getLedgerForUser(Integer userId) {
        return ledgerRepository.findByUserUserIdOrderByDateDesc(userId);
    }

    public BigDecimal getCurrentBalance(Integer userId) {
        return ledgerRepository.getLatestBalance(userId);
    }
}