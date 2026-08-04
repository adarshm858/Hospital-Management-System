package com.example.hms.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateLabTestRequest {

    private String testName;

    private String category;

    private String description;

    private BigDecimal testFee;

    private Boolean available;
}