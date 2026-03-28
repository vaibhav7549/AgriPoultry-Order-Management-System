package com.agripoultry.repository;

import com.agripoultry.entity.FarmerPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FarmerPaymentRepository extends JpaRepository<FarmerPayment, Integer> {
    List<FarmerPayment> findByFarmerUserId(Integer farmerId);
    List<FarmerPayment> findByDistributorUserId(Integer distributorId);
    List<FarmerPayment> findBySaleSaleId(Integer saleId);
}