package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateLabReportRequest;
import com.example.hms.dto.request.UpdateLabReportRequest;
import com.example.hms.dto.response.LabReportResponse;

import java.util.List;

public interface LabReportService {

    LabReportResponse createLabReport(CreateLabReportRequest request);

    List<LabReportResponse> getAllLabReports();

    LabReportResponse getLabReportById(Long id);

    List<LabReportResponse> getReportsByPatient(Long patientId);

    List<LabReportResponse> getReportsByDoctor(Long doctorId);

    LabReportResponse updateLabReport(Long id, UpdateLabReportRequest request);

    void deleteLabReport(Long id);
}