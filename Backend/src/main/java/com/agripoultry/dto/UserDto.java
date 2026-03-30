package com.agripoultry.dto;

import com.agripoultry.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

public class UserDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotBlank private String name;
        @NotBlank private String phone;
        @NotNull  private User.Role role;
        private String address;
        private String username;
        private String password;
        private String email;
        private String company;
        private String avatar;
        private String region;
        private String department;
        private String village;
        private String taluka;
        private String district;
        private String state;
        private String assignedDistributorId;
        private String assignedDistributorName;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private String id;
        private Integer userId;
        private String name;
        private String username;
        private String phone;
        private String email;
        private String dob;
        private User.Role role;
        private String company;
        private String gstin;
        private String address;
        private String avatar;
        private String region;
        private String department;
        private String village;
        private String taluka;
        private String district;
        private String state;
        private String farmSize;
        private String interests;
        private String assignedDistributorId;
        private String assignedDistributorName;
        private Integer totalOrders;
        private Integer activeOrders;

        public static Response from(User u) {
            String rolePrefix = u.getRole() == User.Role.DISTRIBUTOR ? "D" : u.getRole() == User.Role.FARMER ? "F" : "C";
            String frontendId = rolePrefix + String.format("%03d", u.getUserId());
            return Response.builder()
                    .id(frontendId)
                    .userId(u.getUserId())
                    .name(u.getName())
                    .username(u.getUsername())
                    .phone(u.getPhone())
                    .email(u.getEmail())
                    .dob(u.getDob())
                    .role(u.getRole())
                    .company(u.getCompany())
                    .gstin(u.getGstin())
                    .address(u.getAddress())
                    .avatar(u.getAvatar())
                    .region(u.getRegion())
                    .department(u.getDepartment())
                    .village(u.getVillage())
                    .taluka(u.getTaluka())
                    .district(u.getDistrict())
                    .state(u.getState())
                    .farmSize(u.getFarmSize())
                    .interests(u.getInterests())
                    .assignedDistributorId(u.getAssignedDistributor() != null ? "D" + String.format("%03d", u.getAssignedDistributor().getUserId()) : null)
                    .assignedDistributorName(u.getAssignedDistributor() != null ? u.getAssignedDistributor().getName() : null)
                    .build();
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String identifier;
        private String password;
        private String role;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LoginResponse {
        private boolean success;
        private Response user;
        private String error;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String phone;
        private String email;
        private String username;
        private String company;
        private String address;
        private String gstin;
        private String region;
        private String department;
        private String password;
        private String role;
        // Farmer-specific
        private String village;
        private String taluka;
        private String district;
        private String state;
        private String assignedDistributorId;
        private String assignedDistributorName;
        private String dob;
        private String farmSize;
        private List<String> interests;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RegisterResponse {
        private boolean success;
        private String error;
        private String username;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ResetPasswordRequest {
        private String identifier;
        private String newPassword;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ResetPasswordResponse {
        private boolean success;
        private String error;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class ProfileUpdateRequest {
        private String name;
        private String phone;
        private String email;
        private String company;
        private String address;
        private String region;
        private String gstin;
        private String village;
        private String taluka;
        private String district;
        private String state;
        private String dob;
        private String farmSize;
        // interests are stored as comma-separated string in DB
        private List<String> interests;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}