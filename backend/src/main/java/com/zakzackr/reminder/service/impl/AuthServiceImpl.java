package com.zakzackr.reminder.service.impl;

import com.zakzackr.reminder.dto.JwtAuthResponse;
import com.zakzackr.reminder.dto.LoginDto;
import com.zakzackr.reminder.dto.RegisterDto;
import com.zakzackr.reminder.entity.Role;
import com.zakzackr.reminder.entity.User;
import com.zakzackr.reminder.exception.ReminderAPIException;
import com.zakzackr.reminder.exception.ResourceNotFoundException;
import com.zakzackr.reminder.repository.RoleRepository;
import com.zakzackr.reminder.repository.UserRepository;
import com.zakzackr.reminder.security.JwtTokenProvider;
import com.zakzackr.reminder.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;

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

        Set<Role> roles = new HashSet<>();
        Role role = roleRepository.findByRole("ROLE_USER");
        roles.add(role);
        user.setRoles(roles);

        userRepository.save(user);

        return "Successfully registered!!";
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto){
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(),
                loginDto.getPassword()
        ));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        Optional<User> userOptional = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail());

        String role = null;
        Long userId = null;

        if (userOptional.isPresent()){
            User loggedInUser = userOptional.get();
            Optional<Role> roleOptional = loggedInUser.getRoles().stream().findFirst();

            userId = loggedInUser.getId();

            if (roleOptional.isPresent()){
                Role userRole = roleOptional.get();
                role = userRole.getRole();
            }
        }

        JwtAuthResponse jwtAuthResponse = new JwtAuthResponse();
        jwtAuthResponse.setAccessToken(token);
        jwtAuthResponse.setRole(role);
        jwtAuthResponse.setUserId(userId);

        return jwtAuthResponse;
    }
}
