package com.example.hms.service.interfaces;

import com.example.hms.dto.request.CreateLabTestRequest;
import com.example.hms.dto.request.UpdateLabTestRequest;
import com.example.hms.dto.response.LabTestResponse;

import java.util.List;

public interface LabTestService {

    LabTestResponse createLabTest(CreateLabTestRequest request);

    List<LabTestResponse> getAllLabTests();

    LabTestResponse getLabTestById(Long id);

    LabTestResponse updateLabTest(Long id, UpdateLabTestRequest request);

    void deleteLabTest(Long id);
}