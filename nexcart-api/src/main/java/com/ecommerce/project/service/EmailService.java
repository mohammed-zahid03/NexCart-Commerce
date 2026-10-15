package com.ecommerce.project.service;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String resetLink);
}