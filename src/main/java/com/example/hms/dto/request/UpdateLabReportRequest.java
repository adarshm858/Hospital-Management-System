package com.example.hms.dto.request;

import com.example.hms.enums.ReportStatus;
import lombok.Data;

@Data
public class UpdateLabReportRequest {

    private String result;

    private String remarks;

    private ReportStatus status;
}