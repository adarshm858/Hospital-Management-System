package com.example.hms.controller;

import com.example.hms.dto.request.CreateMedicineRequest;
import com.example.hms.dto.request.UpdateMedicineRequest;
import com.example.hms.dto.response.MedicineResponse;
import com.example.hms.service.interfaces.MedicineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public MedicineResponse createMedicine(
            @Valid @RequestBody CreateMedicineRequest request) {
        return medicineService.createMedicine(request);
    }

    @GetMapping
    public List<MedicineResponse> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public MedicineResponse getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id);
    }

    @PutMapping("/{id}")
    public MedicineResponse updateMedicine(
            @PathVariable Long id,
            @RequestBody UpdateMedicineRequest request) {
        return medicineService.updateMedicine(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        medicineService.deleteMedicine(id);
        return "Medicine deleted successfully.";
    }
}