package com.agripoultry.controller;

import com.agripoultry.dto.UserDto;
import com.agripoultry.entity.User;
import com.agripoultry.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // POST /api/users  → register any user (farmer/distributor/company)
    @PostMapping
    public ResponseEntity<UserDto.Response> createUser(@Valid @RequestBody UserDto.Request req) {
        return ResponseEntity.ok(userService.createUser(req));
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserDto.Response> getUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // GET /api/users  OR  GET /api/users?role=FARMER
    @GetMapping
    public ResponseEntity<List<UserDto.Response>> getUsers(
            @RequestParam(required = false) User.Role role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // PUT /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UserDto.Response> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UserDto.Request req) {
        return ResponseEntity.ok(userService.updateUser(id, req));
    }

    // DELETE /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}