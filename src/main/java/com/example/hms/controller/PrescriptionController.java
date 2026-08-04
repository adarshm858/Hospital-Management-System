package com.example.hms.controller;

import com.example.hms.dto.request.CreatePrescriptionRequest;
import com.example.hms.dto.request.UpdatePrescriptionRequest;
import com.example.hms.dto.response.PrescriptionResponse;
import com.example.hms.service.interfaces.PrescriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    public PrescriptionResponse createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request) {
        return prescriptionService.createPrescription(request);
    }

    @GetMapping
    public List<PrescriptionResponse> getAllPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @GetMapping("/{id}")
    public PrescriptionResponse getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id);
    }

    @PutMapping("/{id}")
    public PrescriptionResponse updatePrescription(
            @PathVariable Long id,
            @RequestBody UpdatePrescriptionRequest request) {
        return prescriptionService.updatePrescription(id, request);
    }

    @DeleteMapping("/{id}")
    public String deletePrescription(@PathVariable Long id) {
        prescriptionService.deletePrescription(id);
        return "Prescription deleted successfully.";
    }
}