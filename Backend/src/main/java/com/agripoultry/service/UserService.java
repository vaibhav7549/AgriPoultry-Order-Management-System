package com.agripoultry.service;

import com.agripoultry.dto.UserDto;
import com.agripoultry.entity.User;
import com.agripoultry.entity.BulkOrder;
import com.agripoultry.repository.UserRepository;
import com.agripoultry.repository.BulkOrderRepository;
import com.agripoultry.repository.FarmerOrderRepository;
import com.agripoultry.repository.FarmerPortalOrderRepository;
import com.agripoultry.repository.InvoiceRepository;
import com.agripoultry.repository.NotificationRepository;
import com.agripoultry.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final FarmerPortalOrderRepository farmerPortalOrderRepository;
    private final FarmerOrderRepository farmerOrderRepository;
    private final BulkOrderRepository bulkOrderRepository;
    private final InvoiceRepository invoiceRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationRepository notificationRepository;

    // ─── Auth ───
    public UserDto.LoginResponse login(UserDto.LoginRequest req) {
        User.Role role = User.Role.valueOf(req.getRole().toUpperCase());
        String identifier = req.getIdentifier() != null ? req.getIdentifier().trim() : "";
        String password = req.getPassword();

        // Important: validate password in Java to keep case-sensitivity independent of MySQL collation.
        Optional<User> userOpt = Optional.empty();

        if (!identifier.isEmpty()) {
            // Try username first
            userOpt = userRepository.findByUsernameAndRole(identifier, role);

            // Then try phone
            if (userOpt.isEmpty()) {
                String cleanedPhone = identifier.replaceAll("\\D", "");
                if (!cleanedPhone.isEmpty()) {
                    userOpt = userRepository.findByPhoneAndRole(cleanedPhone, role);
                }
            }
        }

        if (userOpt.isPresent() && userOpt.get().getPassword() != null && Objects.equals(userOpt.get().getPassword(), password)) {
            User user = userOpt.get();
            return UserDto.LoginResponse.builder()
                    .success(true)
                    .user(UserDto.Response.from(user))
                    .build();
        }

        return UserDto.LoginResponse.builder()
                .success(false)
                .error("Invalid username/phone or password")
                .build();
    }

    public UserDto.RegisterResponse register(UserDto.RegisterRequest req) {
        String phone = req.getPhone() != null ? req.getPhone().replaceAll("\\D", "") : null;

        if (phone != null && userRepository.existsByPhone(phone)) {
            return UserDto.RegisterResponse.builder()
                    .success(false)
                    .error("Phone already registered")
                    .build();
        }

        String baseUsername = (req.getUsername() != null && !req.getUsername().isBlank())
                ? req.getUsername().trim()
                : slugify(req.getName());

        if (baseUsername.isBlank()) baseUsername = "user";

        String finalUsername = baseUsername;
        if (userRepository.existsByUsername(finalUsername)) {
            int suffix = 1;
            while (userRepository.existsByUsername(finalUsername + "_" + suffix)) {
                suffix++;
            }
            finalUsername = finalUsername + "_" + suffix;
        }

        User.Role role = User.Role.valueOf(req.getRole().toUpperCase());

        String interestsCsv = null;
        if (req.getInterests() != null && !req.getInterests().isEmpty()) {
            interestsCsv = req.getInterests().stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.joining(","));
            if (interestsCsv.isBlank()) interestsCsv = null;
        }

        User.UserBuilder builder = User.builder()
                .name(req.getName())
                .phone(phone)
                .email(blankToNull(req.getEmail()))
                .username(finalUsername)
                .password(req.getPassword())
                .role(role)
                .company(blankToNull(req.getCompany()))
                .gstin(blankToNull(req.getGstin()))
                .address(blankToNull(req.getAddress()))
                .avatar(req.getName() != null && !req.getName().isEmpty() ? String.valueOf(req.getName().charAt(0)).toUpperCase() : "U")
                .region(blankToNull(req.getRegion()))
                .department(blankToNull(req.getDepartment()))
                .village(blankToNull(req.getVillage()))
                .taluka(blankToNull(req.getTaluka()))
                .district(blankToNull(req.getDistrict()))
                .state(blankToNull(req.getState()))
                .dob(blankToNull(req.getDob()))
                .farmSize(blankToNull(req.getFarmSize()))
                .interests(interestsCsv);

        // Link farmer to distributor if provided
        if (req.getAssignedDistributorId() != null && !req.getAssignedDistributorId().isEmpty()) {
            // assignedDistributorId from frontend is like "D001" — extract numeric part
            try {
                String numPart = req.getAssignedDistributorId().replaceAll("[^0-9]", "");
                int distId = Integer.parseInt(numPart);
                userRepository.findById(distId).ifPresent(builder::assignedDistributor);
            } catch (NumberFormatException ignored) {}
        }

        userRepository.save(builder.build());
        return UserDto.RegisterResponse.builder().success(true).username(finalUsername).build();
    }

    public UserDto.ResetPasswordResponse resetPassword(UserDto.ResetPasswordRequest req) {
        Optional<User> userOpt = userRepository.findByPhone(req.getIdentifier());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(req.getIdentifier());
        }
        if (userOpt.isEmpty()) {
            return UserDto.ResetPasswordResponse.builder().success(false).error("User not found").build();
        }
        User user = userOpt.get();
        user.setPassword(req.getNewPassword());
        userRepository.save(user);
        return UserDto.ResetPasswordResponse.builder().success(true).build();
    }

    public UserDto.Response updateProfile(Integer id, UserDto.ProfileUpdateRequest req) {
        User user = findOrThrow(id);
        if (req.getName() != null) user.setName(req.getName());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getEmail() != null) user.setEmail(req.getEmail());
        if (req.getCompany() != null) user.setCompany(req.getCompany());
        if (req.getAddress() != null) user.setAddress(req.getAddress());
        if (req.getRegion() != null) user.setRegion(req.getRegion());
        if (req.getGstin() != null) user.setGstin(req.getGstin());
        if (req.getVillage() != null) user.setVillage(req.getVillage());
        if (req.getTaluka() != null) user.setTaluka(req.getTaluka());
        if (req.getDistrict() != null) user.setDistrict(req.getDistrict());
        if (req.getState() != null) user.setState(req.getState());
        if (req.getDob() != null) user.setDob(req.getDob());
        if (req.getFarmSize() != null) user.setFarmSize(req.getFarmSize());
        if (req.getInterests() != null) {
            if (req.getInterests().isEmpty()) {
                user.setInterests(null);
            } else {
                String interestsCsv = req.getInterests().stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.joining(","));
                user.setInterests(interestsCsv.isBlank() ? null : interestsCsv);
            }
        }
        return UserDto.Response.from(userRepository.save(user));
    }

    // ─── CRUD (existing) ───
    public UserDto.Response createUser(UserDto.Request req) {
        if (userRepository.findByPhone(req.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already registered: " + req.getPhone());
        }
        User user = User.builder()
                .name(req.getName())
                .username(req.getUsername())
                .password(req.getPassword())
                .phone(req.getPhone())
                .email(req.getEmail())
                .role(req.getRole())
                .company(req.getCompany())
                .address(req.getAddress())
                .avatar(req.getAvatar())
                .region(req.getRegion())
                .department(req.getDepartment())
                .village(req.getVillage())
                .taluka(req.getTaluka())
                .district(req.getDistrict())
                .state(req.getState())
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

    public boolean changePassword(Integer id, UserDto.ChangePasswordRequest req) {
        User user = findOrThrow(id);
        String current = req != null ? req.getCurrentPassword() : null;
        String newPassword = req != null ? req.getNewPassword() : null;
        if (user.getPassword() == null || current == null || newPassword == null) return false;
        if (!Objects.equals(user.getPassword(), current)) return false;
        user.setPassword(newPassword);
        userRepository.save(user);
        return true;
    }

    public void deleteUser(Integer id) {
        User user = findOrThrow(id);
        String userCode = toUserIdCode(user);

        // Delete the user's own records best-effort.
        if (user.getRole() == User.Role.FARMER) {
            farmerPortalOrderRepository.deleteByFarmerIdCode(userCode);
            farmerOrderRepository.deleteByFarmerIdCode(userCode);
            transactionRepository.deleteByUserIdCode(userCode);
            notificationRepository.deleteByUserIdCode(userCode);
        } else if (user.getRole() == User.Role.DISTRIBUTOR) {
            // Distributor-created fulfillment requests (bulk orders)
            List<BulkOrder> bulkOrders = bulkOrderRepository.findByDistributorIdCodeOrderByDateDesc(userCode);
            List<String> orderIds = bulkOrders.stream().map(BulkOrder::getOrderId).toList();
            bulkOrderRepository.deleteByDistributorIdCode(userCode);
            if (!orderIds.isEmpty()) {
                invoiceRepository.deleteByOrderIdIn(orderIds);
            }
            transactionRepository.deleteByUserIdCode(userCode);
            notificationRepository.deleteByUserIdCode(userCode);
        } else {
            // Company account
            transactionRepository.deleteByUserIdCode(userCode);
            notificationRepository.deleteByUserIdCode(userCode);
        }

        userRepository.deleteById(id);
    }

    public User findOrThrow(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    private String slugify(String input) {
        if (input == null) return "";
        return input.toLowerCase()
                .replaceAll("[^a-z0-9]", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");
    }

    private String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private String toUserIdCode(User user) {
        String prefix = user.getRole() == User.Role.DISTRIBUTOR ? "D" : user.getRole() == User.Role.FARMER ? "F" : "C";
        return prefix + String.format("%03d", user.getUserId());
    }
}