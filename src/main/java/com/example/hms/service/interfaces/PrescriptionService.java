package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreatePrescriptionRequest;
import com.example.hms.dto.request.UpdatePrescriptionRequest;
import com.example.hms.dto.response.PrescriptionResponse;

import java.util.List;

public interface PrescriptionService {

    PrescriptionResponse createPrescription(CreatePrescriptionRequest request);

    List<PrescriptionResponse> getAllPrescriptions();

    PrescriptionResponse getPrescriptionById(Long id);

    PrescriptionResponse updatePrescription(Long id, UpdatePrescriptionRequest request);

    void deletePrescription(Long id);
}