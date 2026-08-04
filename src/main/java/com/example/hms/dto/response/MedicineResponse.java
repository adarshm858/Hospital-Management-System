package com.example.hms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MedicineResponse {

    private Long id;

    private String medicineId;

    private String name;

    private String manufacturer;

    private String category;

    private String description;

    private Integer stockQuantity;

    private BigDecimal unitPrice;

    private LocalDate expiryDate;

    private Boolean available;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}