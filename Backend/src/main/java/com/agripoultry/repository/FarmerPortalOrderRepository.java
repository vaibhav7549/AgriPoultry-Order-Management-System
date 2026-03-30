package com.agripoultry.repository;

import com.agripoultry.entity.FarmerPortalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FarmerPortalOrderRepository extends JpaRepository<FarmerPortalOrder, Integer> {
    List<FarmerPortalOrder> findByFarmerIdCodeOrderByDateDesc(String farmerIdCode);
    Optional<FarmerPortalOrder> findByOrderId(String orderId);
    long count();
    void deleteByFarmerIdCode(String farmerIdCode);
}
