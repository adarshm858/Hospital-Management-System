package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateDoctorRequest;
import com.example.hms.dto.request.UpdateDoctorRequest;
import com.example.hms.dto.response.DoctorResponse;

import java.util.List;

public interface DoctorService {

    DoctorResponse createDoctor(CreateDoctorRequest request);

    List<DoctorResponse> getAllDoctors();

    DoctorResponse getDoctorById(Long id);

    DoctorResponse updateDoctor(Long id, UpdateDoctorRequest request);

    void deleteDoctor(Long id);
}