package com.example.hms.repository;

import com.example.hms.entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabReportRepository extends JpaRepository<LabReport, Long> {

    Optional<LabReport> findByReportId(String reportId);

    boolean existsByReportId(String reportId);

    List<LabReport> findByPatientId(Long patientId);

    List<LabReport> findByDoctorId(Long doctorId);
}