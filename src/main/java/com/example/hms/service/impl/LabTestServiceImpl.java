package com.example.hms.service.impl;

import com.example.hms.dto.request.CreateLabTestRequest;
import com.example.hms.dto.request.UpdateLabTestRequest;
import com.example.hms.dto.response.LabTestResponse;
import com.example.hms.entity.LabTest;
import com.example.hms.exception.ResourceNotFoundException;
import com.example.hms.repository.LabTestRepository;
import com.example.hms.service.interfaces.LabTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LabTestServiceImpl implements LabTestService {

    private final LabTestRepository labTestRepository;

    @Override
    public LabTestResponse createLabTest(CreateLabTestRequest request) {

        LabTest labTest = LabTest.builder()
                .testId(generateTestId())
                .testName(request.getTestName())
                .category(request.getCategory())
                .description(request.getDescription())
                .testFee(request.getTestFee())
                .available(true)
                .build();

        labTestRepository.save(labTest);

        return mapToResponse(labTest);
    }

    @Override
    public List<LabTestResponse> getAllLabTests() {

        return labTestRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LabTestResponse getLabTestById(Long id) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found"));

        return mapToResponse(labTest);
    }

    @Override
    public LabTestResponse updateLabTest(Long id, UpdateLabTestRequest request) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found"));

        if (request.getTestName() != null)
            labTest.setTestName(request.getTestName());

        if (request.getCategory() != null)
            labTest.setCategory(request.getCategory());

        if (request.getDescription() != null)
            labTest.setDescription(request.getDescription());

        if (request.getTestFee() != null)
            labTest.setTestFee(request.getTestFee());

        if (request.getAvailable() != null)
            labTest.setAvailable(request.getAvailable());

        labTestRepository.save(labTest);

        return mapToResponse(labTest);
    }

    @Override
    public void deleteLabTest(Long id) {

        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lab test not found"));

        labTestRepository.delete(labTest);
    }

    private String generateTestId() {

        long count = labTestRepository.count() + 1;
        return String.format("TEST%06d", count);
    }

    private LabTestResponse mapToResponse(LabTest labTest) {

        return LabTestResponse.builder()
                .id(labTest.getId())
                .testId(labTest.getTestId())
                .testName(labTest.getTestName())
                .category(labTest.getCategory())
                .description(labTest.getDescription())
                .testFee(labTest.getTestFee())
                .available(labTest.getAvailable())
                .createdAt(labTest.getCreatedAt())
                .updatedAt(labTest.getUpdatedAt())
                .build();
    }
}