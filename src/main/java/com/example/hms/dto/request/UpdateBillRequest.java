package com.example.hms.dto.request;

import com.example.hms.enums.PaymentMethod;
import com.example.hms.enums.PaymentStatus;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateBillRequest {

    private BigDecimal medicineCharge;

    private BigDecimal labCharge;

    private BigDecimal otherCharge;

    private BigDecimal discount;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;
}