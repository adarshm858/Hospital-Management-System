package com.example.hms.entity;

import com.example.hms.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Column(name = "patient_id", unique = true, nullable = false)
    private String patientId;



    @Column(nullable = false)
    private String firstName;



    private String lastName;



    @Column(unique = true)
    private String email;



    @Column(nullable = false, unique = true)
    private String phone;



    @Enumerated(EnumType.STRING)
    private Gender gender;



    private LocalDate dateOfBirth;



    private String bloodGroup;



    @Column(length = 1000)
    private String address;



    private String city;



    private String state;



    private String country;



    private String emergencyContactName;



    private String emergencyContactPhone;



    @Column(length = 1000)
    private String allergies;



    @Column(length = 3000)
    private String medicalHistory;



    @Column(updatable = false)
    private LocalDateTime createdAt;



    private LocalDateTime updatedAt;




    @PrePersist
    public void onCreate() {

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();

    }



    @PreUpdate
    public void onUpdate() {

        updatedAt = LocalDateTime.now();

    }


}