package com.example.hms.service.impl;

import com.example.hms.dto.response.AppointmentResponse;
import com.example.hms.dto.response.BillResponse;
import com.example.hms.dto.response.PatientProfileResponse;
import com.example.hms.dto.response.PrescriptionResponse;
import com.example.hms.entity.Patient;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.PatientRepository;
import com.example.hms.repository.PrescriptionRepository;
import com.example.hms.service.interfaces.PatientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PatientProfileServiceImpl implements PatientProfileService {


    private final PatientRepository patientRepository;

    private final AppointmentRepository appointmentRepository;

    private final PrescriptionRepository prescriptionRepository;

    private final BillRepository billRepository;



    @Override
    public PatientProfileResponse getPatientProfile(Long patientId) {


        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Patient not found"
                        )
                );



        String name = patient.getFirstName();


        if(patient.getLastName() != null){

            name += " " + patient.getLastName();

        }


        final String patientName = name;



        Integer age = null;


        if(patient.getDateOfBirth() != null){

            age = Period.between(
                    patient.getDateOfBirth(),
                    LocalDate.now()
            ).getYears();

        }




        // Appointment History

        List<AppointmentResponse> appointments =
                appointmentRepository.findByPatient(patient)
                        .stream()
                        .map(appointment ->

                                AppointmentResponse.builder()

                                        .id(appointment.getId())

                                        .appointmentId(
                                                appointment.getAppointmentId()
                                        )

                                        .patientId(
                                                patient.getPatientId()
                                        )

                                        .patientName(
                                                patientName
                                        )

                                        .doctorId(
                                                appointment.getDoctor()
                                                        .getId()
                                                        .toString()
                                        )

                                        .doctorName(
                                                appointment.getDoctor()
                                                        .getFirstName()
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

                                        .build()

                        )
                        .collect(Collectors.toList());






        // Prescription History

        List<PrescriptionResponse> prescriptions =
                prescriptionRepository.findByPatient(patient)
                        .stream()
                        .map(prescription ->

                                PrescriptionResponse.builder()

                                        .id(prescription.getId())

                                        .prescriptionId(
                                                prescription.getPrescriptionId()
                                        )

                                        .appointmentId(
                                                prescription.getAppointment()
                                                        .getId()
                                        )

                                        .patientId(
                                                patient.getId()
                                        )

                                        .patientName(
                                                patientName
                                        )

                                        .doctorId(
                                                prescription.getDoctor()
                                                        .getId()
                                        )

                                        .doctorName(
                                                prescription.getDoctor()
                                                        .getFirstName()
                                        )

                                        .diagnosis(
                                                prescription.getDiagnosis()
                                        )

                                        .medicines(
                                                prescription.getMedicines()
                                        )

                                        .dosage(
                                                prescription.getDosage()
                                        )

                                        .instructions(
                                                prescription.getInstructions()
                                        )

                                        .notes(
                                                prescription.getNotes()
                                        )

                                        .createdAt(
                                                prescription.getCreatedAt()
                                        )

                                        .updatedAt(
                                                prescription.getUpdatedAt()
                                        )

                                        .build()

                        )
                        .collect(Collectors.toList());







        // Bill History

        List<BillResponse> bills =
                billRepository.findByPatient(patient)
                        .stream()
                        .map(bill ->

                                BillResponse.builder()

                                        .id(bill.getId())

                                        .billId(
                                                bill.getBillId()
                                        )

                                        .appointmentId(
                                                bill.getAppointment()
                                                        .getId()
                                        )

                                        .patientId(
                                                patient.getId()
                                        )

                                        .patientName(
                                                patientName
                                        )

                                        .doctorId(
                                                bill.getDoctor()
                                                        .getId()
                                        )

                                        .doctorName(
                                                bill.getDoctor()
                                                        .getFirstName()
                                        )

                                        .consultationFee(
                                                bill.getConsultationFee()
                                        )

                                        .medicineCharge(
                                                bill.getMedicineCharge()
                                        )

                                        .labCharge(
                                                bill.getLabCharge()
                                        )

                                        .otherCharge(
                                                bill.getOtherCharge()
                                        )

                                        .discount(
                                                bill.getDiscount()
                                        )

                                        .totalAmount(
                                                bill.getTotalAmount()
                                        )

                                        .paymentStatus(
                                                bill.getPaymentStatus()
                                        )

                                        .paymentMethod(
                                                bill.getPaymentMethod()
                                        )

                                        .createdAt(
                                                bill.getCreatedAt()
                                        )

                                        .updatedAt(
                                                bill.getUpdatedAt()
                                        )

                                        .build()

                        )
                        .collect(Collectors.toList());







        return PatientProfileResponse.builder()

                .id(patient.getId())

                .name(patientName)

                .phone(patient.getPhone())

                .email(patient.getEmail())

                .gender(
                        patient.getGender() != null
                                ?
                                patient.getGender().toString()
                                :
                                null
                )

                .age(age)

                .bloodGroup(patient.getBloodGroup())

                .address(patient.getAddress())

                .appointments(appointments)

                .prescriptions(prescriptions)

                .bills(bills)

                .build();


    }


}