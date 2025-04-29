package com.zakzackr.reminder.config;

import com.zakzackr.reminder.security.JwtAuthenticationEntryPoint;
import com.zakzackr.reminder.security.JwtAuthenticationFilter;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;


@Configuration
@EnableMethodSecurity
@AllArgsConstructor
public class SpringSecurityConfig {

    // private UserDetailsService userDetailsService;
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // This SecurityFilterChain obj will be managed by ioc container.
    // This filter chain will be used by Spring Security for handling incoming HTTP requests
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf((csrf) -> csrf.disable())
            .authorizeHttpRequests(authorize -> {
                authorize.requestMatchers("/auth/register").permitAll();
                authorize.requestMatchers("/auth/login").permitAll();
                authorize.requestMatchers("/auth/token").permitAll(); 
                authorize.requestMatchers("/healthcheck").permitAll(); 
                authorize.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                authorize.anyRequest().authenticated();
            });

        // Spring securityのdefaultのlogout機能を無効にして、controllerで受け取る。
        http.logout(logout -> logout.disable());

        http.exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint));

        // adding the custom filter before UsernamePasswordAuthenticationFilter in the filter chain
        // it will intercept and process all requests before they hit the REST endpoints.
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "https://shibainuu.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // no need to explicitly provide userDetailsService instance to this authenticationManager method,
    // as spring sec. automatically calls userDetailsService.loadByUsername method when userDetailsService is injected in SpringSecurityConfig class.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
