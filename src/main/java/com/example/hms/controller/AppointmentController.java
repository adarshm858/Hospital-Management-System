package com.example.hms.controller;

import com.example.hms.dto.request.CreateAppointmentRequest;
import com.example.hms.dto.request.UpdateAppointmentRequest;
import com.example.hms.dto.response.AppointmentResponse;
import com.example.hms.service.interfaces.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public AppointmentResponse createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {

        return appointmentService.createAppointment(request);
    }

    @GetMapping
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public AppointmentResponse getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id);
    }

    @PutMapping("/{id}")
    public AppointmentResponse updateAppointment(
            @PathVariable Long id,
            @RequestBody UpdateAppointmentRequest request) {

        return appointmentService.updateAppointment(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteAppointment(@PathVariable Long id) {

        appointmentService.deleteAppointment(id);

        return "Appointment deleted successfully.";
    }
}