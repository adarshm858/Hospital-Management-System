package com.example.hms.dto.request;

import com.example.hms.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBillRequest {

    @NotNull
    private Long appointmentId;

    private BigDecimal medicineCharge;

    private BigDecimal labCharge;

    private BigDecimal otherCharge;

    private BigDecimal discount;

    private PaymentMethod paymentMethod;
}