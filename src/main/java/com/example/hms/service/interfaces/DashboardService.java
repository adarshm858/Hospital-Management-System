package com.example.hms.service.interfaces;

import com.example.hms.dto.response.ActivityResponse;

import java.util.List;

public interface DashboardService {


    List<ActivityResponse> getRecentActivity();


}