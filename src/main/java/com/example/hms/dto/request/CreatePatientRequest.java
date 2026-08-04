package com.example.hms.dto.request;

import com.example.hms.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreatePatientRequest {

    @NotBlank
    private String firstName;

    private String lastName;

    @Email
    private String email;

    @NotBlank
    private String phone;

    private Gender gender;

    private LocalDate dateOfBirth;

    private String bloodGroup;

    private String address;

    private String city;

    private String state;

    private String country;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private String allergies;

    private String medicalHistory;
}