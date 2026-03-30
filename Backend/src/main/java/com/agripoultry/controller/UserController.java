package com.agripoultry.controller;

import com.agripoultry.dto.UserDto;
import com.agripoultry.entity.User;
import com.agripoultry.service.UserService;
import com.agripoultry.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserDto.Response>> getAll(@RequestParam(required = false) String role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(User.Role.valueOf(role.toUpperCase())));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto.Response> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<UserDto.Response> updateProfile(@PathVariable Integer id, @RequestBody UserDto.ProfileUpdateRequest req) {
        return ResponseEntity.ok(userService.updateProfile(id, req));
    }

    // Get distributors list for farmer registration dropdown
    @GetMapping("/distributors")
    public ResponseEntity<List<Map<String, Object>>> getDistributors() {
        List<Map<String, Object>> result = userRepository.findByRole(User.Role.DISTRIBUTOR).stream()
                .map(u -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", "D" + String.format("%03d", u.getUserId()));
                    m.put("name", u.getName());
                    m.put("region", u.getRegion());
                    m.put("phone", u.getPhone());
                    return m;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Get farmers under a distributor
    @GetMapping("/farmers")
    public ResponseEntity<List<Map<String, Object>>> getFarmers(@RequestParam(required = false) Integer distributorId) {
        List<User> farmers;
        if (distributorId != null) {
            farmers = userRepository.findByAssignedDistributorUserId(distributorId);
        } else {
            farmers = userRepository.findByRole(User.Role.FARMER);
        }
        List<Map<String, Object>> result = farmers.stream()
                .map(u -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", "F" + String.format("%03d", u.getUserId()));
                    m.put("name", u.getName());
                    m.put("phone", u.getPhone());
                    m.put("village", u.getVillage());
                    m.put("district", u.getDistrict());
                    m.put("totalOrders", 0);
                    return m;
                }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<UserDto.Response> create(@RequestBody UserDto.Request req) {
        return ResponseEntity.ok(userService.createUser(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Integer id,
            @RequestBody UserDto.ChangePasswordRequest req
    ) {
        boolean ok = userService.changePassword(id, req);
        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Current password is incorrect"));
        }
        return ResponseEntity.ok(Map.of("success", true));
    }
}