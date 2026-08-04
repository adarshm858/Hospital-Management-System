package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateBillRequest;
import com.example.hms.dto.request.UpdateBillRequest;
import com.example.hms.dto.response.BillResponse;
import com.example.hms.entity.Appointment;
import com.example.hms.entity.Bill;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.AppointmentRepository;
import com.example.hms.repository.BillRepository;
import com.example.hms.service.interfaces.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillServiceImpl implements BillService {


    private final BillRepository billRepository;

    private final AppointmentRepository appointmentRepository;



    @Override
    public BillResponse createBill(CreateBillRequest request) {


        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));



        BigDecimal medicineCharge = request.getMedicineCharge() != null
                ? request.getMedicineCharge()
                : BigDecimal.ZERO;


        BigDecimal labCharge = request.getLabCharge() != null
                ? request.getLabCharge()
                : BigDecimal.ZERO;


        BigDecimal otherCharge = request.getOtherCharge() != null
                ? request.getOtherCharge()
                : BigDecimal.ZERO;


        BigDecimal discount = request.getDiscount() != null
                ? request.getDiscount()
                : BigDecimal.ZERO;



        BigDecimal consultationFee =
                appointment.getDoctor().getConsultationFee() != null
                        ? appointment.getDoctor().getConsultationFee()
                        : BigDecimal.ZERO;



        BigDecimal totalAmount = consultationFee
                .add(medicineCharge)
                .add(labCharge)
                .add(otherCharge)
                .subtract(discount);



        Bill bill = Bill.builder()

                .billId(generateBillId())

                .appointment(appointment)

                .patient(appointment.getPatient())

                .doctor(appointment.getDoctor())

                .consultationFee(consultationFee)

                .medicineCharge(medicineCharge)

                .labCharge(labCharge)

                .otherCharge(otherCharge)

                .discount(discount)

                .totalAmount(totalAmount)

                .paymentMethod(request.getPaymentMethod())

                .build();



        billRepository.save(bill);



        return mapToResponse(bill);

    }




    @Override
    public List<BillResponse> getAllBills() {

        return billRepository.findAll()

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }




    @Override
    public BillResponse getBillById(Long id) {


        Bill bill = billRepository.findById(id)

                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));


        return mapToResponse(bill);

    }





    @Override
    public BillResponse updateBill(Long id, UpdateBillRequest request) {


        Bill bill = billRepository.findById(id)

                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));



        if(request.getMedicineCharge() != null)

            bill.setMedicineCharge(request.getMedicineCharge());



        if(request.getLabCharge() != null)

            bill.setLabCharge(request.getLabCharge());



        if(request.getOtherCharge() != null)

            bill.setOtherCharge(request.getOtherCharge());



        if(request.getDiscount() != null)

            bill.setDiscount(request.getDiscount());



        if(request.getPaymentStatus() != null)

            bill.setPaymentStatus(request.getPaymentStatus());



        if(request.getPaymentMethod() != null)

            bill.setPaymentMethod(request.getPaymentMethod());




        BigDecimal consultationFee = bill.getConsultationFee() != null
                ? bill.getConsultationFee()
                : BigDecimal.ZERO;


        BigDecimal medicineCharge = bill.getMedicineCharge() != null
                ? bill.getMedicineCharge()
                : BigDecimal.ZERO;


        BigDecimal labCharge = bill.getLabCharge() != null
                ? bill.getLabCharge()
                : BigDecimal.ZERO;


        BigDecimal otherCharge = bill.getOtherCharge() != null
                ? bill.getOtherCharge()
                : BigDecimal.ZERO;


        BigDecimal discount = bill.getDiscount() != null
                ? bill.getDiscount()
                : BigDecimal.ZERO;




        BigDecimal total = consultationFee

                .add(medicineCharge)

                .add(labCharge)

                .add(otherCharge)

                .subtract(discount);



        bill.setTotalAmount(total);



        billRepository.save(bill);



        return mapToResponse(bill);

    }





    @Override
    public void deleteBill(Long id) {


        Bill bill = billRepository.findById(id)

                .orElseThrow(() -> new ResourceNotFoundException("Bill not found"));



        billRepository.delete(bill);

    }





    private String generateBillId() {


        long count = billRepository.count() + 1;


        return String.format("BILL%06d", count);

    }





    private BillResponse mapToResponse(Bill bill) {


        String patientName = bill.getPatient().getFirstName();



        if(bill.getPatient().getLastName() != null) {

            patientName += " " + bill.getPatient().getLastName();

        }



        String doctorName = bill.getDoctor().getFirstName();



        if(bill.getDoctor().getLastName() != null) {

            doctorName += " " + bill.getDoctor().getLastName();

        }



        return BillResponse.builder()

                .id(bill.getId())

                .billId(bill.getBillId())

                .appointmentId(bill.getAppointment().getId())

                .patientId(bill.getPatient().getId())

                .patientName(patientName)

                .doctorId(bill.getDoctor().getId())

                .doctorName(doctorName)

                .consultationFee(bill.getConsultationFee())

                .medicineCharge(bill.getMedicineCharge())

                .labCharge(bill.getLabCharge())

                .otherCharge(bill.getOtherCharge())

                .discount(bill.getDiscount())

                .totalAmount(bill.getTotalAmount())

                .paymentStatus(bill.getPaymentStatus())

                .paymentMethod(bill.getPaymentMethod())

                .createdAt(bill.getCreatedAt())

                .updatedAt(bill.getUpdatedAt())

                .build();

    }

}