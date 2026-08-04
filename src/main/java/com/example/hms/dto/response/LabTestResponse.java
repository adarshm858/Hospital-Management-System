package com.example.hms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class LabTestResponse {

    private Long id;

    private String testId;

    private String testName;

    private String category;

    private String description;

    private BigDecimal testFee;

    private Boolean available;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}