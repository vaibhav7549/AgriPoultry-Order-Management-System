package com.agripoultry.repository;

import com.agripoultry.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findAllByOrderByDateDesc();
    void deleteByOrderIdIn(List<String> orderIds);
}
