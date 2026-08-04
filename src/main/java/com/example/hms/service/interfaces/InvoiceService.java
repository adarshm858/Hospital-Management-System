package com.example.hms.service.interfaces;

import org.springframework.http.ResponseEntity;

public interface InvoiceService {

    byte[] generateInvoice(Long billId);

}