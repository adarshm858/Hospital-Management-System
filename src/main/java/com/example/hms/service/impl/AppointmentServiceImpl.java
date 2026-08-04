package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateAppointmentRequest;
import com.example.hms.dto.request.UpdateAppointmentRequest;
import com.example.hms.dto.response.AppointmentResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.AppointmentStatus;
import com.example.hms.entity.Doctor;
import com.example.hms.entity.Patient;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.DoctorRepository;
import com.example.hms.repository.PatientRepository;
import com.example.hms.service.interfaces.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;


    @Override
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));


        Appointment appointment = Appointment.builder()
                .appointmentId(generateAppointmentId())
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status(AppointmentStatus.SCHEDULED)
                .build();


        Appointment savedAppointment = appointmentRepository.save(appointment);

        return mapToResponse(savedAppointment);

    }



    @Override
    public List<AppointmentResponse> getAllAppointments() {

        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();

    }



    @Override
    public AppointmentResponse getAppointmentById(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));


        return mapToResponse(appointment);

    }




    @Override
    public AppointmentResponse updateAppointment(Long id, UpdateAppointmentRequest request) {


        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));



        if(request.getAppointmentDate() != null){

            appointment.setAppointmentDate(
                    request.getAppointmentDate()
            );

        }



        if(request.getAppointmentTime() != null){

            appointment.setAppointmentTime(
                    request.getAppointmentTime()
            );

        }



        if(request.getReason() != null){

            appointment.setReason(
                    request.getReason()
            );

        }



        if(request.getStatus() != null){

            appointment.setStatus(
                    request.getStatus()
            );

        }



        Appointment updatedAppointment =
                appointmentRepository.save(appointment);



        return mapToResponse(updatedAppointment);

    }




    @Override
    public void deleteAppointment(Long id) {


        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));


        appointmentRepository.delete(appointment);

    }




    private String generateAppointmentId() {

        long count = appointmentRepository.count() + 1;

        return String.format("APT%06d", count);

    }




    private AppointmentResponse mapToResponse(Appointment appointment) {


        return AppointmentResponse.builder()


                .id(
                        appointment.getId()
                )


                .appointmentId(
                        appointment.getAppointmentId()
                )



                .patientId(
                        appointment.getPatient()
                                .getId()
                                .toString()
                )



                .patientName(
                        appointment.getPatient().getFirstName()
                                + " "
                                + appointment.getPatient().getLastName()
                )



                .doctorId(
                        appointment.getDoctor()
                                .getId()
                                .toString()
                )



                .doctorName(
                        appointment.getDoctor().getFirstName()
                                + " "
                                + appointment.getDoctor().getLastName()
                )



                .appointmentDate(
                        appointment.getAppointmentDate()
                )



                .appointmentTime(
                        appointment.getAppointmentTime()
                )



                .reason(
                        appointment.getReason()
                )



                .status(
                        appointment.getStatus()
                )


                .build();

    }

}