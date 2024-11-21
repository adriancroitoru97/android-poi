package com.ugabuga.android_poi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotEmpty
    @Size(min = 1, max = 30)
    private String firstName;
    @NotEmpty
    @Size(min = 1, max = 30)
    private String lastName;
    @Email
    private String email;
    @Size(min = 8, max = 255)
    private String password;
}
