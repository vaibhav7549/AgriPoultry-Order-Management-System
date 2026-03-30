package com.agripoultry.repository;

import com.agripoultry.entity.BulkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BulkOrderRepository extends JpaRepository<BulkOrder, Integer> {
    List<BulkOrder> findAllByOrderByDateDesc();
    List<BulkOrder> findByDistributorIdCodeOrderByDateDesc(String distributorIdCode);
    Optional<BulkOrder> findByOrderId(String orderId);
    long count();
    void deleteByDistributorIdCode(String distributorIdCode);
}
