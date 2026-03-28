package com.agripoultry.repository;

import com.agripoultry.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {
    List<SaleItem> findBySaleSaleId(Integer saleId);
}