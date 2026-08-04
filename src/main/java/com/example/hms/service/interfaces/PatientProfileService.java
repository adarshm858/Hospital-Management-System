package com.example.hms.service.interfaces;

import com.example.hms.dto.response.PatientProfileResponse;

public interface PatientProfileService {


    PatientProfileResponse getPatientProfile(Long patientId);


}