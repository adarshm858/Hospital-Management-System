package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreatePatientRequest;
import com.example.hms.dto.request.UpdatePatientRequest;
import com.example.hms.dto.response.PatientResponse;

import java.util.List;

public interface PatientService {

    PatientResponse createPatient(CreatePatientRequest request);

    List<PatientResponse> getAllPatients();

    PatientResponse getPatientById(Long id);

    PatientResponse updatePatient(Long id, UpdatePatientRequest request);

    void deletePatient(Long id);
}