package com.example.hms.controller;

import com.example.hms.dto.response.ActivityResponse;
import com.example.hms.repository.*;
import com.example.hms.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {


    private final PatientRepository patientRepository;

    private final DoctorRepository doctorRepository;

    private final AppointmentRepository appointmentRepository;

    private final MedicineRepository medicineRepository;

    private final LabTestRepository labTestRepository;

    private final LabReportRepository labReportRepository;

    private final BillRepository billRepository;


    private final DashboardService dashboardService;



    @GetMapping("/count")
    public Map<String, Object> getDashboardCount() {


        Map<String, Object> data = new HashMap<>();


        try {


            data.put(
                    "patients",
                    patientRepository.count()
            );


            data.put(
                    "doctors",
                    doctorRepository.count()
            );


            data.put(
                    "appointments",
                    appointmentRepository.count()
            );


            data.put(
                    "medicines",
                    medicineRepository.count()
            );


            data.put(
                    "labTests",
                    labTestRepository.count()
            );


            data.put(
                    "labReports",
                    labReportRepository.count()
            );


            data.put(
                    "bills",
                    billRepository.count()
            );


            BigDecimal revenue = billRepository.findTotalRevenue();


            data.put(
                    "revenue",
                    revenue != null ? revenue : BigDecimal.ZERO
            );



        } catch(Exception e) {


            log.error(
                    "Dashboard count fetch failed",
                    e
            );


            data.put("patients",0L);
            data.put("doctors",0L);
            data.put("appointments",0L);
            data.put("medicines",0L);
            data.put("labTests",0L);
            data.put("labReports",0L);
            data.put("bills",0L);
            data.put("revenue",BigDecimal.ZERO);


        }


        return data;

    }




    @GetMapping("/activity")
    public List<ActivityResponse> getRecentActivity() {


        return dashboardService.getRecentActivity();

    }


}