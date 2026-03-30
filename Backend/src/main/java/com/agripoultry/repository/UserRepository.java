package com.agripoultry.repository;

import com.agripoultry.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    List<User> findByRole(User.Role role);
    Optional<User> findByPhone(String phone);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameAndPasswordAndRole(String username, String password, User.Role role);
    Optional<User> findByPhoneAndPasswordAndRole(String phone, String password, User.Role role);
    Optional<User> findByUsernameAndRole(String username, User.Role role);
    Optional<User> findByPhoneAndRole(String phone, User.Role role);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
    List<User> findByAssignedDistributorUserId(Integer distributorId);
}