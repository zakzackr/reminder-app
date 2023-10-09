package com.zakzackr.reminder.service;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);

    JwtAuthResponse login(LoginDto loginDto);
}
