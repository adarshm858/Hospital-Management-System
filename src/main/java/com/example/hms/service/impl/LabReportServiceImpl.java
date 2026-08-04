package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateLabReportRequest;
import com.example.hms.dto.request.UpdateLabReportRequest;
import com.example.hms.dto.response.LabReportResponse;
import com.example.hms.entity.Doctor;
import com.example.hms.entity.LabReport;
import com.example.hms.entity.LabTest;
import com.example.hms.entity.Patient;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.DoctorRepository;
import com.example.hms.repository.LabReportRepository;
import com.example.hms.repository.LabTestRepository;
import com.example.hms.repository.PatientRepository;
import com.example.hms.service.interfaces.LabReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabReportServiceImpl implements LabReportService {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final LabTestRepository labTestRepository;


    @Override
    public LabReportResponse createLabReport(CreateLabReportRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LabTest labTest = labTestRepository.findById(request.getLabTestId())
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found"));


        LabReport report = LabReport.builder()
                .reportId(generateReportId())
                .patient(patient)
                .doctor(doctor)
                .labTest(labTest)
                .result(request.getResult())
                .remarks(request.getRemarks())
                .build();

        labReportRepository.save(report);

        return mapToResponse(report);
    }


    @Override
    public List<LabReportResponse> getAllLabReports() {

        return labReportRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public LabReportResponse getLabReportById(Long id) {

        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab report not found"));

        return mapToResponse(report);
    }


    @Override
    public List<LabReportResponse> getReportsByPatient(Long patientId) {

        return labReportRepository.findByPatientId(patientId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public List<LabReportResponse> getReportsByDoctor(Long doctorId) {

        return labReportRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    @Override
    public LabReportResponse updateLabReport(Long id, UpdateLabReportRequest request) {

        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab report not found"));


        if (request.getResult() != null)
            report.setResult(request.getResult());

        if (request.getRemarks() != null)
            report.setRemarks(request.getRemarks());

        if (request.getStatus() != null)
            report.setStatus(request.getStatus());


        labReportRepository.save(report);

        return mapToResponse(report);
    }


    @Override
    public void deleteLabReport(Long id) {

        LabReport report = labReportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab report not found"));

        labReportRepository.delete(report);
    }


    private String generateReportId() {

        long count = labReportRepository.count() + 1;
        return String.format("REP%06d", count);
    }


    private LabReportResponse mapToResponse(LabReport report) {

        String patientName = report.getPatient().getFirstName();

        if (report.getPatient().getLastName() != null) {
            patientName += " " + report.getPatient().getLastName();
        }


        String doctorName = report.getDoctor().getFirstName();

        if (report.getDoctor().getLastName() != null) {
            doctorName += " " + report.getDoctor().getLastName();
        }


        return LabReportResponse.builder()
                .id(report.getId())
                .reportId(report.getReportId())
                .patientId(report.getPatient().getId())
                .patientName(patientName)
                .doctorId(report.getDoctor().getId())
                .doctorName(doctorName)
                .labTestId(report.getLabTest().getId())
                .labTestName(report.getLabTest().getTestName())
                .result(report.getResult())
                .remarks(report.getRemarks())
                .status(report.getStatus())
                .reportDate(report.getReportDate())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}