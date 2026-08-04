package com.example.hms.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePrescriptionRequest {

    @NotNull
    private Long appointmentId;

    @NotBlank
    private String diagnosis;

    @NotBlank
    private String medicines;

    @NotBlank
    private String dosage;

    private String instructions;

    private String notes;
}