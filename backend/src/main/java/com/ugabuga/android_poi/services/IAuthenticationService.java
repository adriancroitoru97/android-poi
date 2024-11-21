package com.ugabuga.android_poi.services;

import com.ugabuga.android_poi.dto.AuthenticationRequest;
import com.ugabuga.android_poi.dto.AuthenticationResponse;
import com.ugabuga.android_poi.dto.RegisterRequest;

public interface IAuthenticationService {
    AuthenticationResponse register(RegisterRequest request);

    AuthenticationResponse authenticate(AuthenticationRequest request);
}
