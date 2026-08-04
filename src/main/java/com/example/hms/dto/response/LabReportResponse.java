package com.example.hms.dto.response;

import com.example.hms.enums.ReportStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class LabReportResponse {

    private Long id;

    private String reportId;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private Long labTestId;

    private String labTestName;

    private String result;

    private String remarks;

    private ReportStatus status;

    private LocalDateTime reportDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}