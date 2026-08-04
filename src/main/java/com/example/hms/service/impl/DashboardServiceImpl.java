package com.example.hms.service.impl;

import com.example.hms.dto.response.ActivityResponse;
import com.example.hms.entity.Bill;
import com.example.hms.entity.LabReport;
import com.example.hms.entity.Patient;
import com.example.hms.repository.BillRepository;
import com.example.hms.repository.LabReportRepository;
import com.example.hms.repository.PatientRepository;
import com.example.hms.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {


    private final PatientRepository patientRepository;

    private final BillRepository billRepository;

    private final LabReportRepository labReportRepository;



    @Override
    public List<ActivityResponse> getRecentActivity() {


        List<ActivityResponse> activities = new ArrayList<>();



        List<Patient> patients = patientRepository.findAll();


        patients.stream()
                .sorted(
                        Comparator.comparing(
                                Patient::getCreatedAt
                        ).reversed()
                )
                .limit(5)
                .forEach(patient -> {


                    activities.add(
                            ActivityResponse.builder()

                                    .type("PATIENT")

                                    .message(
                                            "New patient added: "
                                                    + patient.getFirstName()
                                    )

                                    .time(
                                            patient.getCreatedAt()
                                    )

                                    .build()
                    );


                });





        List<Bill> bills = billRepository.findAll();


        bills.stream()
                .sorted(
                        Comparator.comparing(
                                Bill::getCreatedAt
                        ).reversed()
                )
                .limit(5)
                .forEach(bill -> {


                    activities.add(

                            ActivityResponse.builder()

                                    .type("BILL")

                                    .message(
                                            "Bill generated: "
                                                    + bill.getBillId()
                                                    + " Amount ₹"
                                                    + bill.getTotalAmount()
                                    )

                                    .time(
                                            bill.getCreatedAt()
                                    )

                                    .build()

                    );


                });






        List<LabReport> reports = labReportRepository.findAll();


        reports.stream()
                .sorted(
                        Comparator.comparing(
                                LabReport::getCreatedAt
                        ).reversed()
                )
                .limit(5)
                .forEach(report -> {


                    activities.add(

                            ActivityResponse.builder()

                                    .type("LAB_REPORT")

                                    .message(
                                            "Lab report uploaded"
                                    )

                                    .time(
                                            report.getCreatedAt()
                                    )

                                    .build()

                    );


                });





        activities.sort(
                Comparator.comparing(
                        ActivityResponse::getTime
                ).reversed()
        );


        return activities.stream()
                .limit(10)
                .toList();


    }


}