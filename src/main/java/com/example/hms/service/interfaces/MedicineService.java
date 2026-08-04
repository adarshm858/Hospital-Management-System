package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateMedicineRequest;
import com.example.hms.dto.request.UpdateMedicineRequest;
import com.example.hms.dto.response.MedicineResponse;

import java.util.List;

public interface MedicineService {

    MedicineResponse createMedicine(CreateMedicineRequest request);

    List<MedicineResponse> getAllMedicines();

    MedicineResponse getMedicineById(Long id);

    MedicineResponse updateMedicine(Long id, UpdateMedicineRequest request);

    void deleteMedicine(Long id);
}