package com.example.hms.repository;

import com.example.hms.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    Optional<Doctor> findByDoctorId(String doctorId);

    List<Doctor> findBySpecialization(String specialization);
}