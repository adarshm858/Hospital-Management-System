package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateMedicineRequest;
import com.example.hms.dto.request.UpdateMedicineRequest;
import com.example.hms.dto.response.MedicineResponse;
import com.example.hms.entity.Medicine;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.MedicineRepository;
import com.example.hms.service.interfaces.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;

    @Override
    public MedicineResponse createMedicine(CreateMedicineRequest request) {

        Medicine medicine = Medicine.builder()
                .medicineId(generateMedicineId())
                .name(request.getName())
                .manufacturer(request.getManufacturer())
                .category(request.getCategory())
                .description(request.getDescription())
                .stockQuantity(request.getStockQuantity())
                .unitPrice(request.getUnitPrice())
                .expiryDate(request.getExpiryDate())
                .available(true)
                .build();

        medicineRepository.save(medicine);

        return mapToResponse(medicine);
    }

    @Override
    public List<MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MedicineResponse getMedicineById(Long id) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));

        return mapToResponse(medicine);
    }

    @Override
    public MedicineResponse updateMedicine(Long id, UpdateMedicineRequest request) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));

        if (request.getName() != null)
            medicine.setName(request.getName());

        if (request.getManufacturer() != null)
            medicine.setManufacturer(request.getManufacturer());

        if (request.getCategory() != null)
            medicine.setCategory(request.getCategory());

        if (request.getDescription() != null)
            medicine.setDescription(request.getDescription());

        if (request.getStockQuantity() != null)
            medicine.setStockQuantity(request.getStockQuantity());

        if (request.getUnitPrice() != null)
            medicine.setUnitPrice(request.getUnitPrice());

        if (request.getExpiryDate() != null)
            medicine.setExpiryDate(request.getExpiryDate());

        if (request.getAvailable() != null)
            medicine.setAvailable(request.getAvailable());

        medicineRepository.save(medicine);

        return mapToResponse(medicine);
    }

    @Override
    public void deleteMedicine(Long id) {

        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine not found"));

        medicineRepository.delete(medicine);
    }

    private String generateMedicineId() {

        long count = medicineRepository.count() + 1;
        return String.format("MED%06d", count);
    }

    private MedicineResponse mapToResponse(Medicine medicine) {

        return MedicineResponse.builder()
                .id(medicine.getId())
                .medicineId(medicine.getMedicineId())
                .name(medicine.getName())
                .manufacturer(medicine.getManufacturer())
                .category(medicine.getCategory())
                .description(medicine.getDescription())
                .stockQuantity(medicine.getStockQuantity())
                .unitPrice(medicine.getUnitPrice())
                .expiryDate(medicine.getExpiryDate())
                .available(medicine.getAvailable())
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .build();
    }
}