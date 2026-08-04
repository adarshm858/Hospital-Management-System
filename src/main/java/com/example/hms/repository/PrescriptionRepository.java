package com.example.hms.repository;

import com.example.hms.entity.Patient;
import com.example.hms.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {


    Optional<Prescription> findByPrescriptionId(String prescriptionId);


    boolean existsByPrescriptionId(String prescriptionId);


    List<Prescription> findByPatient(Patient patient);


}