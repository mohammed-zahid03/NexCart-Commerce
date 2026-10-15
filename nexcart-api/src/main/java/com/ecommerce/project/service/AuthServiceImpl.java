package com.ecommerce.project.service;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.Role;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.AuthenticationResult;
import com.ecommerce.project.payload.UserDTO;
import com.ecommerce.project.payload.UserResponse;
import com.ecommerce.project.repositories.RoleRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.jwt.JwtUtils;
import com.ecommerce.project.security.request.LoginRequest;
import com.ecommerce.project.security.request.SignupRequest;
import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.security.response.UserInfoResponse;
import com.ecommerce.project.security.services.UserDetailsImpl;
import com.ecommerce.project.util.AuthUtil;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.security.request.CreateSellerRequest;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import com.ecommerce.project.repositories.OrderRepository;
import java.util.Map;
import com.ecommerce.project.model.PasswordResetToken;
import com.ecommerce.project.repositories.PasswordResetTokenRepository;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import java.util.Optional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${frontend.url}")
    private String frontendUrl;


    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles, userDetails.getEmail(), jwtCookie.toString());

        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));


        Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() ->
                        new RuntimeException("Error: Role is not found.")
                );

        Set<Role> roles = new HashSet<>();
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Override
    public ResponseEntity<MessageResponse> register(CreateSellerRequest createSellerRequest) {

        if (userRepository.existsByUserName(createSellerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(createSellerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = new User(
                createSellerRequest.getUsername(),
                createSellerRequest.getEmail(),
                encoder.encode(createSellerRequest.getPassword())
        );

        Role sellerRole = roleRepository.findByRoleName(AppRole.ROLE_SELLER)
                .orElseThrow(() ->
                        new RuntimeException("Error: Role is not found.")
                );

        Set<Role> roles = new HashSet<>();
        roles.add(sellerRole);

        user.setRoles(roles);

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("Seller registered successfully!")
        );
    }

    @Override
    public UserInfoResponse getCurrentUserDetails(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles);

        return response;
    }

    @Override
    public ResponseCookie logoutUser() {
        return jwtUtils.getCleanJwtCookie();
    }

    @Override
    public UserResponse getAllSellers(Pageable pageable) {
        Page<User> allUsers = userRepository.findByRoleName(AppRole.ROLE_SELLER, pageable);
        List<UserDTO> userDtos =
                allUsers.getContent()
                        .stream()
                        .map(user -> modelMapper.map(user, UserDTO.class))
                        .collect(Collectors.toList());

        UserResponse response = new UserResponse();
        response.setContent(userDtos);
        response.setPageNumber(allUsers.getNumber());
        response.setPageSize(allUsers.getSize());
        response.setTotalElements(allUsers.getTotalElements());
        response.setTotalPages(allUsers.getTotalPages());
        response.setLastPage(allUsers.isLast());
        return response;
    }

    @Override
    public UserResponse getAllCustomers(Pageable pageable) {

        Page<User> allCustomers =
                userRepository.findCustomers(
                        AppRole.ROLE_USER,
                        AppRole.ROLE_ADMIN,
                        pageable
                );

        List<UserDTO> userDtos =
                allCustomers.getContent()
                        .stream()
                        .map(user -> modelMapper.map(user, UserDTO.class))
                        .collect(Collectors.toList());

        if (!userDtos.isEmpty()) {

            List<String> customerEmails =
                    userDtos.stream()
                            .map(UserDTO::getEmail)
                            .filter(email -> email != null && !email.isBlank())
                            .collect(Collectors.toList());

            if (!customerEmails.isEmpty()) {

                List<Object[]> stats =
                        orderRepository.getCustomerOrderStats(
                                customerEmails
                        );

                Map<String, Object[]> statsByEmail =
                        stats.stream()
                                .collect(Collectors.toMap(
                                        row -> ((String) row[0]).toLowerCase(),
                                        row -> row
                                ));

                for (UserDTO customer : userDtos) {

                    Object[] row =
                            statsByEmail.get(
                                    customer.getEmail().toLowerCase()
                            );

                    if (row != null) {
                        customer.setOrdersCount(
                                ((Number) row[1]).longValue()
                        );

                        customer.setTotalSpent(
                                ((Number) row[2]).doubleValue()
                        );
                    } else {
                        customer.setOrdersCount(0L);
                        customer.setTotalSpent(0.0);
                    }
                }
            }
        }

        UserResponse response = new UserResponse();

        response.setContent(userDtos);
        response.setPageNumber(allCustomers.getNumber());
        response.setPageSize(allCustomers.getSize());
        response.setTotalElements(allCustomers.getTotalElements());
        response.setTotalPages(allCustomers.getTotalPages());
        response.setLastPage(allCustomers.isLast());

        return response;
    }

    @Override
    public ResponseEntity<MessageResponse> updateCustomerStatus(
            Long customerId,
            boolean active
    ) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Error: Customer not found.")
                );

        boolean isCustomer = customer.getRoles().stream()
                .anyMatch(role ->
                        role.getRoleName().equals(AppRole.ROLE_USER)
                );

        boolean isAdmin = customer.getRoles().stream()
                .anyMatch(role ->
                        role.getRoleName().equals(AppRole.ROLE_ADMIN)
                );

        if (!isCustomer || isAdmin) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "Error: User is not a customer."
                    ));
        }

        customer.setAccountActive(active);
        userRepository.save(customer);

        return ResponseEntity.ok(
                new MessageResponse(
                        active
                                ? "Customer activated successfully!"
                                : "Customer blocked successfully!"
                )
        );
    }

    @Override
    public ResponseEntity<MessageResponse> deleteSeller(Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new RuntimeException("Error: Seller not found."));

        if (!seller.getRoles().stream()
                .anyMatch(role ->
                        role.getRoleName().equals(AppRole.ROLE_SELLER))) {

            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "Error: User is not a seller."
                    ));
        }

        if (productRepository.existsByUser(seller)) {

            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "Cannot delete seller because the seller has existing products."
                    ));
        }

        userRepository.delete(seller);

        return ResponseEntity.ok(
                new MessageResponse(
                        "Seller deleted successfully!"
                )
        );
    }

    @Override
    public ResponseEntity<MessageResponse> updateSellerStatus(
            Long sellerId,
            boolean active
    ) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new RuntimeException("Error: Seller not found."));

        if (!seller.getRoles().stream()
                .anyMatch(role ->
                        role.getRoleName().equals(AppRole.ROLE_SELLER))) {

            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "Error: User is not a seller."
                    ));
        }

        seller.setSellerActive(active);

        userRepository.save(seller);

        auditLogService.log(
                "SELLER_STATUS_UPDATED",
                "Seller",
                seller.getUserId(),
                "Seller #" + seller.getUserId()
                        + " status changed to "
                        + (active ? "ACTIVE" : "SUSPENDED"),
                authUtil.loggedInEmail()
        );

        return ResponseEntity.ok(
                new MessageResponse(
                        active
                                ? "Seller activated successfully!"
                                : "Seller suspended successfully!"
                )
        );
    }

    @Override
    public ResponseEntity<MessageResponse> forgotPassword(String email) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            // Generate a new token
            String token = UUID.randomUUID().toString();

            PasswordResetToken resetToken =
                    passwordResetTokenRepository.findByUser(user)
                            .orElseGet(PasswordResetToken::new);

            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + token;

            emailService.sendPasswordResetEmail(
                    user.getEmail(),
                    resetLink
            );
        }

        // Same response whether email exists or not
        return ResponseEntity.ok(
                new MessageResponse(
                        "If an account exists with this email, a password reset link has been sent."
                )
        );
    }


    @Override
    public ResponseEntity<MessageResponse> resetPassword(
            String token,
            String newPassword
    ) {

        Optional<PasswordResetToken> tokenOptional =
                passwordResetTokenRepository.findByToken(token);

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid or expired reset token."));
        }

        PasswordResetToken resetToken = tokenOptional.get();

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {

            passwordResetTokenRepository.delete(resetToken);

            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid or expired reset token."));
        }

        User user = resetToken.getUser();

// Prevent reusing the current password
        if (encoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "New password cannot be the same as your current password."
                    ));
        }

// Prevent using username as password
        if (newPassword.equalsIgnoreCase(user.getUserName())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(
                            "Password cannot be the same as your username."
                    ));
        }

        user.setPassword(encoder.encode(newPassword));

        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(
                new MessageResponse("Password reset successfully.")
        );
    }

}
