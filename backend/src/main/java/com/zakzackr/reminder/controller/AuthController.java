package com.zakzackr.reminder.controller;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;
import com.zakzackr.reminder.service.AuthService;
import com.zakzackr.reminder.service.email.EmailSenderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {

    private AuthService authService;
    private EmailSenderService senderService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto){
        String response = authService.register(registerDto);

        senderService.sendRegistrationEmail(
                registerDto.getEmail(),
                "Hi " + registerDto.getUsername() + ", welcome to Reminder App!!"
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> login(@RequestBody LoginDto loginDto){
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);

        return ResponseEntity.ok(jwtAuthResponse);
    }
}
