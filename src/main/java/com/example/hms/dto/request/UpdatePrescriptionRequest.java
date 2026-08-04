package com.example.hms.dto.request;

import lombok.Data;

@Data
public class UpdatePrescriptionRequest {

    private String diagnosis;

    private String medicines;

    private String dosage;

    private String instructions;

    private String notes;
}