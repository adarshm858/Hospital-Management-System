package com.example.hms.dto.request;

import com.example.hms.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdatePatientRequest {

    private String firstName;
    private String lastName;
    private String email;
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