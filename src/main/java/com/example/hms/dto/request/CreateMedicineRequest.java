package com.example.hms.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateMedicineRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String manufacturer;

    @NotBlank
    private String category;

    private String description;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal unitPrice;

    @NotNull
    private LocalDate expiryDate;
}