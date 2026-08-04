package com.example.hms.service.impl;

import com.example.hms.entity.Bill;
import com.example.hms.repository.BillRepository;
import com.example.hms.service.interfaces.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;


@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {


    private final BillRepository billRepository;



    @Override
    public byte[] generateInvoice(Long billId) {


        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found")
                );


        try {


            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();



            Document document = new Document();



            PdfWriter.getInstance(
                    document,
                    outputStream
            );



            document.open();



            Font titleFont = new Font(
                    Font.HELVETICA,
                    20,
                    Font.BOLD
            );



            document.add(
                    new Paragraph(
                            "HOSPITAL MANAGEMENT SYSTEM",
                            titleFont
                    )
            );



            document.add(
                    new Paragraph(
                            "Invoice"
                    )
            );


            document.add(
                    new Paragraph(
                            " "
                    )
            );



            document.add(
                    new Paragraph(
                            "Bill ID : " + bill.getBillId()
                    )
            );


            document.add(
                    new Paragraph(
                            "Date : " +
                                    bill.getCreatedAt()
                                            .format(
                                                    DateTimeFormatter.ofPattern(
                                                            "dd-MM-yyyy HH:mm"
                                                    )
                                            )
                    )
            );



            document.add(
                    new Paragraph(
                            "Patient : "
                                    + bill.getPatient().getFirstName()
                    )
            );



            document.add(
                    new Paragraph(
                            "Doctor : Dr. "
                                    + bill.getDoctor().getFirstName()
                    )
            );



            document.add(
                    new Paragraph(
                            "Consultation Fee : $ "
                                    + bill.getConsultationFee()
                    )
            );


            document.add(
                    new Paragraph(
                            "Medicine Charge : $ "
                                    + bill.getMedicineCharge()
                    )
            );


            document.add(
                    new Paragraph(
                            "Lab Charge : $ "
                                    + bill.getLabCharge()
                    )
            );


            document.add(
                    new Paragraph(
                            "Other Charge : $ "
                                    + bill.getOtherCharge()
                    )
            );


            document.add(
                    new Paragraph(
                            "Discount : $ "
                                    + bill.getDiscount()
                    )
            );


            document.add(
                    new Paragraph(
                            "Total Amount : $ "
                                    + bill.getTotalAmount()
                    )
            );


            document.add(
                    new Paragraph(
                            "Payment Status : "
                                    + bill.getPaymentStatus()
                    )
            );


            document.add(
                    new Paragraph(
                            "Payment Method : "
                                    + bill.getPaymentMethod()
                    )
            );



            document.close();



            return outputStream.toByteArray();



        } catch(Exception e) {


            throw new RuntimeException(
                    "Invoice generation failed",
                    e
            );

        }


    }


}