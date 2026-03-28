package com.agripoultry.service;

import com.agripoultry.dto.UserDto;
import com.agripoultry.entity.User;
import com.agripoultry.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto.Response createUser(UserDto.Request req) {
        if (userRepository.findByPhone(req.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already registered: " + req.getPhone());
        }
        User user = User.builder()
                .name(req.getName())
                .phone(req.getPhone())
                .role(req.getRole())
                .address(req.getAddress())
                .build();
        return UserDto.Response.from(userRepository.save(user));
    }

    public UserDto.Response getUserById(Integer id) {
        return UserDto.Response.from(findOrThrow(id));
    }

    public List<UserDto.Response> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role).stream()
                .map(UserDto.Response::from)
                .collect(Collectors.toList());
    }

    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto.Response::from)
                .collect(Collectors.toList());
    }

    public UserDto.Response updateUser(Integer id, UserDto.Request req) {
        User user = findOrThrow(id);
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        user.setAddress(req.getAddress());
        return UserDto.Response.from(userRepository.save(user));
    }

    public void deleteUser(Integer id) {
        userRepository.deleteById(id);
    }

    // helper used by other services
    public User findOrThrow(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}