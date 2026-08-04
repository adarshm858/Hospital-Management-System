package com.example.hms.controller;

import com.example.hms.dto.request.CreateLabTestRequest;
import com.example.hms.dto.request.UpdateLabTestRequest;
import com.example.hms.dto.response.LabTestResponse;
import com.example.hms.service.interfaces.LabTestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-tests")
@RequiredArgsConstructor
public class LabTestController {

    private final LabTestService labTestService;

    @PostMapping
    public LabTestResponse createLabTest(
            @Valid @RequestBody CreateLabTestRequest request) {
        return labTestService.createLabTest(request);
    }

    @GetMapping
    public List<LabTestResponse> getAllLabTests() {
        return labTestService.getAllLabTests();
    }

    @GetMapping("/{id}")
    public LabTestResponse getLabTestById(@PathVariable Long id) {
        return labTestService.getLabTestById(id);
    }

    @PutMapping("/{id}")
    public LabTestResponse updateLabTest(
            @PathVariable Long id,
            @RequestBody UpdateLabTestRequest request) {
        return labTestService.updateLabTest(id, request);
    }

    @DeleteMapping("/{id}")
    public String deleteLabTest(@PathVariable Long id) {
        labTestService.deleteLabTest(id);
        return "Lab test deleted successfully.";
    }
}