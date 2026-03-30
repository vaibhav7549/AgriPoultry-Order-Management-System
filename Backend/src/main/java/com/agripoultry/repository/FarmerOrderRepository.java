package com.agripoultry.repository;

import com.agripoultry.entity.FarmerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FarmerOrderRepository extends JpaRepository<FarmerOrder, Integer> {
    List<FarmerOrder> findByDistributorUserIdOrderByDateDesc(Integer distributorId);
    List<FarmerOrder> findAllByOrderByDateDesc();
    Optional<FarmerOrder> findByOrderId(String orderId);
    long countByDistributorUserId(Integer distributorId);
    void deleteByFarmerIdCode(String farmerIdCode);
}
