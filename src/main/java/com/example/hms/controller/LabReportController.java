package com.example.hms.controller;

import com.example.hms.dto.request.CreateLabReportRequest;
import com.example.hms.dto.request.UpdateLabReportRequest;
import com.example.hms.dto.response.LabReportResponse;
import com.example.hms.service.interfaces.LabReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-reports")
@RequiredArgsConstructor
public class LabReportController {

    private final LabReportService labReportService;


    @PostMapping
    public LabReportResponse createLabReport(
            @Valid @RequestBody CreateLabReportRequest request) {

        return labReportService.createLabReport(request);
    }


    @GetMapping
    public List<LabReportResponse> getAllLabReports() {

        return labReportService.getAllLabReports();
    }


    @GetMapping("/{id}")
    public LabReportResponse getLabReportById(
            @PathVariable Long id) {

        return labReportService.getLabReportById(id);
    }


    @GetMapping("/patient/{patientId}")
    public List<LabReportResponse> getReportsByPatient(
            @PathVariable Long patientId) {

        return labReportService.getReportsByPatient(patientId);
    }


    @GetMapping("/doctor/{doctorId}")
    public List<LabReportResponse> getReportsByDoctor(
            @PathVariable Long doctorId) {

        return labReportService.getReportsByDoctor(doctorId);
    }


    @PutMapping("/{id}")
    public LabReportResponse updateLabReport(
            @PathVariable Long id,
            @RequestBody UpdateLabReportRequest request) {

        return labReportService.updateLabReport(id, request);
    }


    @DeleteMapping("/{id}")
    public String deleteLabReport(
            @PathVariable Long id) {

        labReportService.deleteLabReport(id);

        return "Lab report deleted successfully.";
    }
}