package com.zakzackr.reminder.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.zakzackr.reminder.exception.JwtTokenException;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${app.jwt-secret}")
    private String jwtSecret;

    @Value("${app.access-token-expiration-milliseconds}")
    private long accessTokenExpirationDate;

    @Value("${app.refresh-token-expiration-milliseconds}")
    private long refreshTokenExpirationDate;

    // Generate Jwt token
    public String generateAccessToken(Authentication authentication){
        // This variable stores either username or email
        String username = authentication.getName();

        // CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // Long userId = userDetails.getUserId();
        // String role = userDetails.getAuthorities().stream()
        //     .findFirst()
        //     .map(GrantedAuthority::getAuthority)
        //     .orElse("ROLE_USER");

        Date currentDate = new Date();
        Date expirationDate = new Date(currentDate.getTime() + accessTokenExpirationDate);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expirationDate)
                // .claim("userId", userId)  
                .signWith(key())
                .compact();

        return token;
    }

    // Generate refresh token 
    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + refreshTokenExpirationDate);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key())
                .compact();

        return token;
    }

    // Validate Jwt token
    public boolean validateAccessToken(String token){
        try{
            Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parse(token);

            return true;
        } catch (ExpiredJwtException e) {
            throw new JwtTokenException("Token expired", e);
        } catch (JwtException e) {
            throw new JwtTokenException("Invalid token", e);
        }
    }

    public boolean validateRefreshToken(String token) {
        try{
            Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parse(token);

            return true;
        } catch (ExpiredJwtException e) {
            throw new JwtTokenException("Token expired", e);
        } catch (JwtException e) {
            throw new JwtTokenException("Invalid token", e);
        }
    }

    // Get username from Jwt token
    public String getUsernameFromToken(String token){
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        return username;
    }

    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }
}
