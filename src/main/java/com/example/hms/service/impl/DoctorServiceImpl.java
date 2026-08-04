package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateDoctorRequest;
import com.example.hms.dto.request.UpdateDoctorRequest;
import com.example.hms.dto.response.DoctorResponse;
import com.example.hms.entity.Doctor;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.DoctorRepository;
import com.example.hms.service.interfaces.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public DoctorResponse createDoctor(CreateDoctorRequest request) {

        if (request.getEmail() != null &&
                doctorRepository.existsByEmail(request.getEmail())) {
            throw new ResourceNotFoundException("Email already exists.");
        }

        if (doctorRepository.existsByPhone(request.getPhone())) {
            throw new ResourceNotFoundException("Phone number already exists.");
        }

        String doctorId = generateDoctorId();

        Doctor doctor = Doctor.builder()
                .doctorId(doctorId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .gender(request.getGender())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .experience(request.getExperience())
                .consultationFee(request.getConsultationFee())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .available(request.getAvailable())
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        return mapToResponse(savedDoctor);
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        return mapToResponse(doctor);
    }

    @Override
    public DoctorResponse updateDoctor(Long id, UpdateDoctorRequest request) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setEmail(request.getEmail());
        doctor.setPhone(request.getPhone());
        doctor.setGender(request.getGender());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperience(request.getExperience());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setAddress(request.getAddress());
        doctor.setCity(request.getCity());
        doctor.setState(request.getState());
        doctor.setCountry(request.getCountry());
        doctor.setAvailable(request.getAvailable());

        Doctor updatedDoctor = doctorRepository.save(doctor);

        return mapToResponse(updatedDoctor);
    }

    @Override
    public void deleteDoctor(Long id) {

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        doctorRepository.delete(doctor);
    }

    private String generateDoctorId() {

        long count = doctorRepository.count() + 1;

        return String.format("DOC%06d", count);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {

        return DoctorResponse.builder()
                .id(doctor.getId())
                .doctorId(doctor.getDoctorId())
                .firstName(doctor.getFirstName())
                .lastName(doctor.getLastName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .gender(doctor.getGender())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .consultationFee(doctor.getConsultationFee())
                .address(doctor.getAddress())
                .city(doctor.getCity())
                .state(doctor.getState())
                .country(doctor.getCountry())
                .available(doctor.getAvailable())
                .build();
    }
}