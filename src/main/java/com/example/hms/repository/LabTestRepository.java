package com.example.hms.repository;

import com.example.hms.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabTestRepository extends JpaRepository<LabTest, Long> {

    Optional<LabTest> findByTestId(String testId);

    boolean existsByTestId(String testId);

    Optional<LabTest> findByTestName(String testName);
}