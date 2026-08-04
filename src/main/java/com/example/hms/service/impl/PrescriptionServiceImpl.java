package com.example.hms.service.impl;

import com.example.hms.dto.request.CreatePrescriptionRequest;
import com.example.hms.dto.request.UpdatePrescriptionRequest;
import com.example.hms.dto.response.PrescriptionResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Prescription;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.service.interfaces.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public PrescriptionResponse createPrescription(CreatePrescriptionRequest request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        Prescription prescription = Prescription.builder()
                .prescriptionId(generatePrescriptionId())
                .appointment(appointment)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .diagnosis(request.getDiagnosis())
                .medicines(request.getMedicines())
                .dosage(request.getDosage())
                .instructions(request.getInstructions())
                .notes(request.getNotes())
                .build();

        prescriptionRepository.save(prescription);

        return mapToResponse(prescription);
    }

    @Override
    public List<PrescriptionResponse> getAllPrescriptions() {

        return prescriptionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponse getPrescriptionById(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        return mapToResponse(prescription);
    }

    @Override
    public PrescriptionResponse updatePrescription(Long id, UpdatePrescriptionRequest request) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        if (request.getDiagnosis() != null)
            prescription.setDiagnosis(request.getDiagnosis());

        if (request.getMedicines() != null)
            prescription.setMedicines(request.getMedicines());

        if (request.getDosage() != null)
            prescription.setDosage(request.getDosage());

        if (request.getInstructions() != null)
            prescription.setInstructions(request.getInstructions());

        if (request.getNotes() != null)
            prescription.setNotes(request.getNotes());

        prescriptionRepository.save(prescription);

        return mapToResponse(prescription);
    }

    @Override
    public void deletePrescription(Long id) {

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found"));

        prescriptionRepository.delete(prescription);
    }

    private String generatePrescriptionId() {

        long count = prescriptionRepository.count() + 1;
        return String.format("PRE%06d", count);
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {

        String patientName = prescription.getPatient().getFirstName();

        if (prescription.getPatient().getLastName() != null &&
                !prescription.getPatient().getLastName().isBlank()) {
            patientName += " " + prescription.getPatient().getLastName();
        }

        String doctorName = prescription.getDoctor().getFirstName();

        if (prescription.getDoctor().getLastName() != null &&
                !prescription.getDoctor().getLastName().isBlank()) {
            doctorName += " " + prescription.getDoctor().getLastName();
        }

        return PrescriptionResponse.builder()
                .id(prescription.getId())
                .prescriptionId(prescription.getPrescriptionId())
                .appointmentId(prescription.getAppointment().getId())
                .patientId(prescription.getPatient().getId())
                .patientName(patientName)
                .doctorId(prescription.getDoctor().getId())
                .doctorName(doctorName)
                .diagnosis(prescription.getDiagnosis())
                .medicines(prescription.getMedicines())
                .dosage(prescription.getDosage())
                .instructions(prescription.getInstructions())
                .notes(prescription.getNotes())
                .createdAt(prescription.getCreatedAt())
                .updatedAt(prescription.getUpdatedAt())
                .build();
    }
}