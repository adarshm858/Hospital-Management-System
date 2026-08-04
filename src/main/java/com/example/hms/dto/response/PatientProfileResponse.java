package com.example.hms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PatientProfileResponse {


    private Long id;

    private String name;

    private String phone;

    private String email;

    private String gender;

    private Integer age;

    private String bloodGroup;

    private String address;


    private List<AppointmentResponse> appointments;

    private List<PrescriptionResponse> prescriptions;

    private List<LabReportResponse> labReports;

    private List<BillResponse> bills;

}