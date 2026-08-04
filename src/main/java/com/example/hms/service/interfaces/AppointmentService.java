package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateAppointmentRequest;
import com.example.hms.dto.request.UpdateAppointmentRequest;
import com.example.hms.dto.response.AppointmentResponse;

import java.util.List;

public interface AppointmentService {

    AppointmentResponse createAppointment(CreateAppointmentRequest request);

    List<AppointmentResponse> getAllAppointments();

    AppointmentResponse getAppointmentById(Long id);

    AppointmentResponse updateAppointment(Long id, UpdateAppointmentRequest request);

    void deleteAppointment(Long id);
}