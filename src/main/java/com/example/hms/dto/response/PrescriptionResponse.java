package com.example.hms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PrescriptionResponse {

    private Long id;

    private String prescriptionId;

    private Long appointmentId;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private String diagnosis;

    private String medicines;

    private String dosage;

    private String instructions;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}