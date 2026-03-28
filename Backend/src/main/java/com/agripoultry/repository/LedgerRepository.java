package com.agripoultry.repository;

import com.agripoultry.entity.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface LedgerRepository extends JpaRepository<Ledger, Integer> {

    // Full transaction history for a user
    List<Ledger> findByUserUserIdOrderByDateDesc(Integer userId);

    // Latest ledger entry to get current running balance
    @Query("SELECT l FROM Ledger l WHERE l.user.userId = :userId ORDER BY l.date DESC, l.ledgerId DESC")
    List<Ledger> findLatestByUserId(@Param("userId") Integer userId);

    default BigDecimal getLatestBalance(Integer userId) {
        List<Ledger> entries = findLatestByUserId(userId);
        if (entries.isEmpty()) return BigDecimal.ZERO;
        return entries.get(0).getBalance();
    }
}