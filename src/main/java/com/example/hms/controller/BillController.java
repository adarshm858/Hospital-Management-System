package com.example.hms.controller;

import com.example.hms.dto.request.CreateBillRequest;
import com.example.hms.dto.request.UpdateBillRequest;
import com.example.hms.dto.response.BillResponse;
import com.example.hms.service.interfaces.BillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @PostMapping
    public BillResponse createBill(
            @Valid @RequestBody CreateBillRequest request) {
        return billService.createBill(request);
    }

    @GetMapping
    public List<BillResponse> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    public BillResponse getBillById(@PathVariable Long id) {
        return billService.getBillById(id);
    }

    @PutMapping("/{id}")
    public BillResponse updateBill(
            @PathVariable Long id,
            @RequestBody UpdateBillRequest request) {
        return billService.updateBill(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return "Bill deleted successfully.";
    }
}