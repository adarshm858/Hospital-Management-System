package com.example.hms.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateLabTestRequest {

    @NotBlank
    private String testName;

    @NotBlank
    private String category;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal testFee;
}