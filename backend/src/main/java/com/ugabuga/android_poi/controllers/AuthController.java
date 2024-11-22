package com.ugabuga.android_poi.controllers;

import com.ugabuga.android_poi.dto.AuthenticationRequest;
import com.ugabuga.android_poi.dto.AuthenticationResponse;
import com.ugabuga.android_poi.dto.RegisterRequest;
import com.ugabuga.android_poi.exceptions.UserAlreadyExistsException;
import com.ugabuga.android_poi.services.IAuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthenticationResponse response = authenticationService.register(request);
            return ResponseEntity.ok(response);
        } catch (UserAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred when registering the user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok().body(authenticationResponse);
    }
}
