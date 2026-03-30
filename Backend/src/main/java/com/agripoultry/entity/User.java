package com.agripoultry.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "username", unique = true, length = 50)
    private String username;

    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "phone", unique = true, length = 15)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    // Farmer-specific optional profile fields
    @Column(name = "dob", length = 20)
    private String dob;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "company", length = 150)
    private String company;

    // Distributor/Company optional GSTIN
    @Column(name = "gstin", length = 20)
    private String gstin;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "avatar", length = 5)
    private String avatar;

    @Column(name = "region", length = 50)
    private String region;

    @Column(name = "department", length = 50)
    private String department;

    @Column(name = "village", length = 100)
    private String village;

    @Column(name = "taluka", length = 100)
    private String taluka;

    @Column(name = "district", length = 100)
    private String district;

    @Column(name = "state", length = 100)
    private String state;

    // Farmer farm profile
    @Column(name = "farm_size", length = 50)
    private String farmSize;

    // Comma-separated list of interests (e.g. "Feed,Layer Chicks")
    @Column(name = "interests", columnDefinition = "TEXT")
    private String interests;

    // Farmer → Distributor relationship
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_distributor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User assignedDistributor;

    public enum Role {
        FARMER, DISTRIBUTOR, COMPANY
    }
}