package com.example.hms.dto.request;

import com.example.hms.entity.Gender;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateDoctorRequest {

    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private Gender gender;
    private String specialization;
    private String qualification;
    private Integer experience;
    private BigDecimal consultationFee;
    private String address;
    private String city;
    private String state;
    private String country;
    private Boolean available;
}