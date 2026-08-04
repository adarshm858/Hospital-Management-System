package com.example.hms.repository;

import com.example.hms.entity.Appointment;
import com.example.hms.entity.Doctor;
import com.example.hms.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    Optional<Appointment> findByAppointmentId(String appointmentId);

    List<Appointment> findByPatient(Patient patient);

    List<Appointment> findByDoctor(Doctor doctor);

    List<Appointment> findByAppointmentDate(LocalDate appointmentDate);

    List<Appointment> findByDoctorAndAppointmentDate(
            Doctor doctor,
            LocalDate appointmentDate
    );
}