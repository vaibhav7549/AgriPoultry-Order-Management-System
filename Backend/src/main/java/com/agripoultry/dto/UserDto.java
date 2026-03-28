package com.agripoultry.dto;

import com.agripoultry.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

public class UserDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Request {
        @NotBlank private String name;
        @NotBlank private String phone;
        @NotNull  private User.Role role;
        private String address;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class Response {
        private Integer userId;
        private String name;
        private String phone;
        private User.Role role;
        private String address;

        public static Response from(User u) {
            return Response.builder()
                    .userId(u.getUserId()).name(u.getName())
                    .phone(u.getPhone()).role(u.getRole())
                    .address(u.getAddress()).build();
        }
    }
}