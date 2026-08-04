package com.example.hms.controller;

import com.example.hms.dto.request.CreateDoctorRequest;
import com.example.hms.dto.request.UpdateDoctorRequest;
import com.example.hms.dto.response.DoctorResponse;
import com.example.hms.service.interfaces.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public DoctorResponse createDoctor(
            @Valid @RequestBody CreateDoctorRequest request) {

        return doctorService.createDoctor(request);
    }

    @GetMapping
    public List<DoctorResponse> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public DoctorResponse getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @PutMapping("/{id}")
    public DoctorResponse updateDoctor(
            @PathVariable Long id,
            @RequestBody UpdateDoctorRequest request) {

        return doctorService.updateDoctor(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return "Doctor deleted successfully.";
    }
}