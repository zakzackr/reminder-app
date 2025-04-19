package com.zakzackr.reminder.controller;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;
import com.zakzackr.reminder.service.AuthService;
import com.zakzackr.reminder.service.email.EmailSenderService;

import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

        // Refresh Token をクッキーに設定（SameSite=None 明示）
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", jwtAuthResponse.getRefreshToken())
            .httpOnly(true)
            .path("/")
            .maxAge(2592000)
            .sameSite("Lax")
            .secure(false) // ← 本番は true。
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

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

        System.out.println("logout()");

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
    public ResponseEntity<?> refreshAccessToken(@CookieValue(required = false) String refreshToken, HttpServletResponse response) {
        
        System.out.println("refresh-token: " + refreshToken);
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            // Cookieが無い、または空 
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token is missing");
        }
        
        try {
            JwtAuthResponse jwtAuthResponse = authService.refreshAccessToken(refreshToken);

            ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", jwtAuthResponse.getRefreshToken())
                .httpOnly(true)
                .path("/")
                .maxAge(2592000)
                .sameSite("Lax")
                .secure(false) // ← 本番は true。
                .build();

            response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            return ResponseEntity.ok(Map.of("accessToken", jwtAuthResponse.getAccessToken()));
        } catch (JwtException e) {
            System.out.println("refreshAccessToken() failed: " + e.getMessage());

            // 無効なrefresh-tokenを削除する
            ResponseCookie clearCookie = ResponseCookie.from("refreshToken", "")
             .httpOnly(true)
             .path("/")
             .maxAge(0)              // 有効期限0 → 削除
             .sameSite("Lax")        // 必要に応じて "None" に（Setしていた属性に合わせて）
             .secure(false)          // 本番なら true に
             .build();
         
            response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("failed to refresh access token");
        }
    }
}
