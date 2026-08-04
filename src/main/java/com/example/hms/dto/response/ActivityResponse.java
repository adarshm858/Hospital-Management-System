package com.example.hms.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponse {


    private String type;


    private String message;


    private LocalDateTime time;


}