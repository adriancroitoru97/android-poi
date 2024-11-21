package com.ugabuga.android_poi.services.impl;

import com.ugabuga.android_poi.dto.AuthenticationRequest;
import com.ugabuga.android_poi.dto.AuthenticationResponse;
import com.ugabuga.android_poi.dto.RegisterRequest;
import com.ugabuga.android_poi.exceptions.UserAlreadyExistsException;
import com.ugabuga.android_poi.models.Role;
import com.ugabuga.android_poi.models.User;
import com.ugabuga.android_poi.repositories.IUserRepository;
import com.ugabuga.android_poi.services.IAuthenticationService;
import com.ugabuga.android_poi.services.IJwtService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final IUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final IJwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final ModelMapper modelMapper;

    @Override
    public AuthenticationResponse register(RegisterRequest request) {
        Optional<User> existingUser = repository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException("User with email already exists");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        repository.save(user);

        String jwtToken = jwtService.generateToken(user);

        AuthenticationResponse authenticationResponseDTO = modelMapper.map(user, AuthenticationResponse.class);
        authenticationResponseDTO.setToken(jwtToken);
        return authenticationResponseDTO;
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        AuthenticationResponse authenticationResponseDTO = modelMapper.map(user, AuthenticationResponse.class);
        authenticationResponseDTO.setToken(jwtToken);
        return authenticationResponseDTO;
    }
}
