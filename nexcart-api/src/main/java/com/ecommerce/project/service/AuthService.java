package com.ecommerce.project.service;

import com.ecommerce.project.payload.AuthenticationResult;
import com.ecommerce.project.payload.UserResponse;
import com.ecommerce.project.security.request.LoginRequest;
import com.ecommerce.project.security.request.SignupRequest;
import com.ecommerce.project.security.response.MessageResponse;
import com.ecommerce.project.security.response.UserInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.ecommerce.project.security.request.CreateSellerRequest;

public interface AuthService {

    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    ResponseEntity<MessageResponse> register(CreateSellerRequest createSellerRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllSellers(Pageable pageable);

    ResponseEntity<MessageResponse> deleteSeller(Long sellerId);

    ResponseEntity<MessageResponse> forgotPassword(String email);

    ResponseEntity<MessageResponse> resetPassword(
            String token,
            String newPassword
    );

    ResponseEntity<MessageResponse> updateSellerStatus(Long sellerId, boolean active);

    UserResponse getAllCustomers(Pageable pageable);

    ResponseEntity<MessageResponse> updateCustomerStatus(
            Long customerId,
            boolean active
    );
}
