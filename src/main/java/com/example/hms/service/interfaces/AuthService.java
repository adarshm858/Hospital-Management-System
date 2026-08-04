package com.example.hms.service.interfaces;

import com.example.hms.dto.request.LoginRequest;
import com.example.hms.dto.request.RegisterRequest;
import com.example.hms.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}