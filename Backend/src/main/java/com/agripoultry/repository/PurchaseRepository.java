package com.agripoultry.repository;

import com.agripoultry.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

    List<Purchase> findByDistributorUserId(Integer distributorId);

    List<Purchase> findByCompanyUserId(Integer companyId);

    Optional<Purchase> findByBulkOrderId(String bulkOrderId);

    // Total due amount a distributor owes a specific company
    @Query("SELECT COALESCE(SUM(p.dueAmount), 0) FROM Purchase p WHERE p.distributor.userId = :distributorId AND p.company.userId = :companyId")
    BigDecimal totalDueByDistributorToCompany(@Param("distributorId") Integer distributorId, @Param("companyId") Integer companyId);
}