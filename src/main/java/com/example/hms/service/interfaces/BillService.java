package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateBillRequest;
import com.example.hms.dto.request.UpdateBillRequest;
import com.example.hms.dto.response.BillResponse;

import java.util.List;

public interface BillService {

    BillResponse createBill(CreateBillRequest request);

    List<BillResponse> getAllBills();

    BillResponse getBillById(Long id);

    BillResponse updateBill(Long id, UpdateBillRequest request);

    void deleteBill(Long id);
}