package com.example.hms.controller;

import com.example.hms.dto.response.PatientProfileResponse;
import com.example.hms.service.interfaces.PatientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientProfileController {


    private final PatientProfileService patientProfileService;



    @GetMapping("/{id}/profile")
    public PatientProfileResponse getPatientProfile(
            @PathVariable Long id
    ) {

        return patientProfileService.getPatientProfile(id);

    }


}