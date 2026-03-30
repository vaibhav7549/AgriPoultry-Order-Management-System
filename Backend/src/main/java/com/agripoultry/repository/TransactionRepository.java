package com.agripoultry.repository;

import com.agripoultry.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserIdCodeOrderByDateDesc(String userIdCode);
    List<Transaction> findAllByOrderByDateDesc();
    void deleteByUserIdCode(String userIdCode);
}
