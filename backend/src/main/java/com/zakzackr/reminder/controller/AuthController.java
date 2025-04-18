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

import java.util.Map;

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
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        JwtAuthResponse jwtAuthResponse = authService.login(loginDto);

        // Refresh Tokenをクッキーに設定
        Cookie cookie = new Cookie("refreshToken", jwtAuthResponse.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(2592000); // a month
        response.addCookie(cookie);

        System.out.println("login success!! acess-token and refresh-token has been created");

        return ResponseEntity.ok(Map.of("accessToken", jwtAuthResponse.getAccessToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {

        // cookieを削除して、refresh-tokenを無効にする
        Cookie clearCookie = new Cookie("refreshToken", null);
        clearCookie.setHttpOnly(true);
        clearCookie.setPath("/");
        clearCookie.setMaxAge(0);

        response.addCookie(clearCookie);

        return ResponseEntity.ok().build();
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
    public ResponseEntity<?> refreshAccessToken(@RequestBody String refreshToken, HttpServletResponse response) {
        try {
            JwtAuthResponse jwtAuthResponse = authService.refreshAccessToken(refreshToken);

            Cookie refreshTokenCookie = new Cookie("refreshToken", jwtAuthResponse.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(2592000); 
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.ok(Map.of("accessToken", jwtAuthResponse.getAccessToken()));
        } catch (JwtException e) {
            System.out.println("refreshAccessToken() failed: " + e.getMessage());

             // 無効なrefresh-tokenを削除する
            Cookie clearCookie = new Cookie("refreshToken", null);
            clearCookie.setHttpOnly(true);
            clearCookie.setPath("/");
            clearCookie.setMaxAge(0); // 有効期限0で削除
            response.addCookie(clearCookie);

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("failed to refresh access token");
        }
    }
}
