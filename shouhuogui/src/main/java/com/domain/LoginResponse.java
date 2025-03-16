package com.domain;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private User userInfo;
} 