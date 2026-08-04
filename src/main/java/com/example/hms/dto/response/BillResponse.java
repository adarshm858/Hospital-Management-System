package com.example.hms.dto.response;

import com.example.hms.enums.PaymentMethod;
import com.example.hms.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BillResponse {

    private Long id;

    private String billId;

    private Long appointmentId;

    private Long patientId;

    private String patientName;

    private Long doctorId;

    private String doctorName;

    private BigDecimal consultationFee;

    private BigDecimal medicineCharge;

    private BigDecimal labCharge;

    private BigDecimal otherCharge;

    private BigDecimal discount;

    private BigDecimal totalAmount;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}