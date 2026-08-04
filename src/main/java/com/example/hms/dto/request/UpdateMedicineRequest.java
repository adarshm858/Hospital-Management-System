package com.example.hms.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateMedicineRequest {

    private String name;

    private String manufacturer;

    private String category;

    private String description;

    private Integer stockQuantity;

    private BigDecimal unitPrice;

    private LocalDate expiryDate;

    private Boolean available;
}