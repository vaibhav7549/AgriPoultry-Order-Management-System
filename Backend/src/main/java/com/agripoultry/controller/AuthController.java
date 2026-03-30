package com.agripoultry.controller;

import com.agripoultry.dto.UserDto;
import com.agripoultry.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<UserDto.LoginResponse> login(@RequestBody UserDto.LoginRequest req) {
        UserDto.LoginResponse resp = userService.login(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto.RegisterResponse> register(@RequestBody UserDto.RegisterRequest req) {
        UserDto.RegisterResponse resp = userService.register(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<UserDto.ResetPasswordResponse> resetPassword(@RequestBody UserDto.ResetPasswordRequest req) {
        UserDto.ResetPasswordResponse resp = userService.resetPassword(req);
        return ResponseEntity.ok(resp);
    }
}
