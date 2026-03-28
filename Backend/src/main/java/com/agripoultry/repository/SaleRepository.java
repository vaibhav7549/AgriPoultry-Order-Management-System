package com.agripoultry.repository;

import com.agripoultry.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    // All sales for a specific farmer
    List<Sale> findByFarmerUserId(Integer farmerId);

    // All sales handled by a specific distributor
    List<Sale> findByDistributorUserId(Integer distributorId);

    // All unpaid / partial sales for a farmer (their dues)
    List<Sale> findByFarmerUserIdAndStatusIn(Integer farmerId, List<Sale.SaleStatus> statuses);

    // All unpaid / partial sales for a distributor (what farmers owe them)
    List<Sale> findByDistributorUserIdAndStatusIn(Integer distributorId, List<Sale.SaleStatus> statuses);

    // Total due amount a farmer owes a specific distributor
    @Query("SELECT COALESCE(SUM(s.dueAmount), 0) FROM Sale s WHERE s.farmer.userId = :farmerId AND s.distributor.userId = :distributorId AND s.status <> 'PAID'")
    BigDecimal totalDueByFarmerToDistributor(@Param("farmerId") Integer farmerId, @Param("distributorId") Integer distributorId);
}