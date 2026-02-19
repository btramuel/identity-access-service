package com.brian.iam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brian.iam.dto.AuthResponse;
import com.brian.iam.dto.LoginRequest;
import com.brian.iam.dto.MessageResponse;
import com.brian.iam.dto.RegisterRequest;
import com.brian.iam.security.JwtService;
import com.brian.iam.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(AuthService authService, AuthenticationManager authManager, JwtService jwtService) {
        this.authService = authService;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest req) {
        authService.register(req);
        return ResponseEntity.ok(new MessageResponse("User registered"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username, req.password)
        );

        String token = jwtService.generateToken(req.username);
        return ResponseEntity.ok(new AuthResponse(token));
    }
    @PostMapping("/bootstrap-admin")
public ResponseEntity<MessageResponse> bootstrapAdmin() {
    authService.registerAdmin("admin1", "admin1@test.com", "AdminPass123!");
    return ResponseEntity.ok(new MessageResponse("Admin user created"));
 }
}