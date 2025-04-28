package com.zakzackr.reminder.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zakzackr.reminder.exception.JwtTokenException;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AllArgsConstructor
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private JwtTokenProvider jwtTokenProvider;
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Get Jwt token from Http request
        String token = getAcessTokenFromRequest(request);
        String url = request.getRequestURI();
        logger.info("Request URL: " + url);

        if (url.equals("/healthcheck")) {
            logger.info("url equals /healthcheck, before doFilter");
            filterChain.doFilter(request, response);
            logger.info("url equals /healthcheck, after doFilter");
            return;
        }
        
        try {
            logger.info("before token validation: " + url);
            // Validate token
            if (StringUtils.hasText(token) && jwtTokenProvider.validateAccessToken(token)){
                logger.info("inside token validation if: " + url);
                //Get username from token
                String username = jwtTokenProvider.getUsernameFromToken(token);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
            logger.info("before doFilter(): " + url);
            filterChain.doFilter(request, response);
            logger.info("after doFilter(): " + url);

        } catch (JwtTokenException e) {
            logger.info("JwtTokenExeption: " + url);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"message\": \"" + e.getMessage() + "\"}");
        } 
    }

    // get JWT token from cookie
    private String getAcessTokenFromRequest(HttpServletRequest request){

        String bearerToken = request.getHeader("authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            return bearerToken.substring(7);
        }

        return null;
    }
}
