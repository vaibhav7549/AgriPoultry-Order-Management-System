package com.agripoultry.repository;

import com.agripoultry.entity.BulkOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BulkOrderItemRepository extends JpaRepository<BulkOrderItem, Integer> {
}
