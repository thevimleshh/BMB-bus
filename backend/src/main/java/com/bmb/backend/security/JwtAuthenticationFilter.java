package com.bmb.backend.security;

import com.bmb.backend.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Signup aur Login ko JWT ki zarurat nahi hai
        if (request.getRequestURI().equals("/api/auth/signup") ||
                request.getRequestURI().equals("/api/auth/login")) {

            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader =
                request.getHeader("Authorization");

        String jwt = null;
        String userEmail = null;

        // Authorization header check
        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            jwt = authHeader.substring(7);

            try {
                userEmail = jwtService.extractUsername(jwt);
            } catch (Exception e) {
                System.out.println("Invalid JWT token");
            }
        }

        // User authenticate karo
        if (userEmail != null &&
                SecurityContextHolder.getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(userEmail);

            if (jwtService.isTokenValid(jwt, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        }

        // Request ko next filter par bhejo
        filterChain.doFilter(request, response);
    }
}