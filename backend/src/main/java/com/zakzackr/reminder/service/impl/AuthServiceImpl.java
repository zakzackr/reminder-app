package com.zakzackr.reminder.service.impl;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;
import com.zakzackr.reminder.entity.Role;
import com.zakzackr.reminder.entity.User;
import com.zakzackr.reminder.exception.ReminderAPIException;
import com.zakzackr.reminder.repository.RoleRepository;
import com.zakzackr.reminder.repository.UserRepository;
import com.zakzackr.reminder.security.JwtTokenProvider;
import com.zakzackr.reminder.service.AuthService;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UserDetailsService;


@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;
    private UserDetailsService userDetailsService;

    @Override
    public String register(RegisterDto registerDto) {

        if (userRepository.existsByUsername(registerDto.getUsername())){
            throw new ReminderAPIException(HttpStatus.BAD_REQUEST, "The username is already used.");
        }

        if (userRepository.existsByEmail((registerDto.getEmail()))){
            throw new ReminderAPIException(HttpStatus.BAD_REQUEST, "The email address is already used.");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Role role = roleRepository.findByRole("ROLE_USER");
        user.setRole(role); 

        userRepository.save(user);

        return "Successfully registered!!";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto){
//        it is passing the UsernamePasswordAuthenticationToken to the default AuthenticationProvider,
//        which will use the userDetailsService to get the user based on username and compare that user's password with the one in the authentication token.

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        // Optional<User> userOptional = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail());

        // String role = null;
        // Long userId = null;

        // if (userOptional.isPresent()){
        //     User loggedInUser = userOptional.get();
        //     Optional<Role> roleOptional = Optional.ofNullable(loggedInUser.getRole());

        //     userId = loggedInUser.getId();

        //     if (roleOptional.isPresent()){
        //         Role userRole = roleOptional.get();
        //         role = userRole.getRole();
        //     }
        // }

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse(accessToken, refreshToken);
        return jwtAuthResponse;
    }

    // create new access token using valid refresh token
    public JwtAuthResponse refreshAccessToken(String refreshToken){
        jwtTokenProvider.validateRefreshToken(refreshToken);

        String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userDetails, 
            null, 
            userDetails.getAuthorities()
        );

        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication); 
        return new JwtAuthResponse(newAccessToken, newRefreshToken);
    } 
}

