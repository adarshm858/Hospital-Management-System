package com.example.hms.repository;

import com.example.hms.entity.Bill;
import com.example.hms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {


    List<Bill> findByPatient(Patient patient);



    @Query("SELECT COALESCE(SUM(b.totalAmount),0) FROM Bill b")
    BigDecimal findTotalRevenue();


}