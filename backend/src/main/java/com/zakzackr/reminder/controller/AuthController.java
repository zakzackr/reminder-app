package com.zakzackr.reminder.controller;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;
import com.zakzackr.reminder.exception.ReminderAPIException;
import com.zakzackr.reminder.service.AuthService;
import com.zakzackr.reminder.service.email.EmailSenderService;

import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;




@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
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
    public ResponseEntity<Void> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);
        
        // JWTをクッキーで保管
        Cookie accessTokenCookie = new Cookie("accessToken", jwtAuthResponse.getAccessToken());
        accessTokenCookie.setHttpOnly(true); // HTTPのみのクッキー
        accessTokenCookie.setPath("/"); // クッキーのパスを設定
        accessTokenCookie.setMaxAge(3600); // クッキーの有効期限を設定（an hour）
        response.addCookie(accessTokenCookie); // レスポンスにクッキーを追加

        // Refresh Tokenをクッキーに設定
        Cookie refreshTokenCookie = new Cookie("refreshToken", jwtAuthResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(2592000); // a month
        response.addCookie(refreshTokenCookie);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<String> checkLoginStatus() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.isAuthenticated()
            && !(authentication instanceof AnonymousAuthenticationToken)) {
            return ResponseEntity.ok("authenticated");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("unauthenticated");
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Void> refreshAccessToken(@RequestBody String refreshToken, HttpServletResponse response) {
        try {
            JwtAuthResponse jwtAuthResponse = authService.refreshAccessToken(refreshToken);

            Cookie accessTokenCookie = new Cookie("accessToken", jwtAuthResponse.getAccessToken());
            accessTokenCookie.setHttpOnly(true); 
            accessTokenCookie.setPath("/"); 
            accessTokenCookie.setMaxAge(3600); 
            response.addCookie(accessTokenCookie); 

            Cookie refreshTokenCookie = new Cookie("refreshToken", jwtAuthResponse.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(2592000); 
            response.addCookie(refreshTokenCookie);

            System.out.println("new access and refresh token have been created successfully...");

            return ResponseEntity.ok().build();
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}
