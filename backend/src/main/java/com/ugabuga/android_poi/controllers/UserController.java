package com.ugabuga.android_poi.controllers;

import com.ugabuga.android_poi.models.User;
import com.ugabuga.android_poi.repositories.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserRepository userRepository;

    @GetMapping("/get")
    public ResponseEntity<User> getUser(@RequestParam int id) {
        return ResponseEntity.ok(userRepository.findById(id).orElse(null));
    }
}
