package com.ecommerce.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("NexCart - Password Reset");
        message.setText(
                "Hello,\n\n"
                        + "We received a request to reset your NexCart password.\n\n"
                        + "Click the link below to reset your password:\n"
                        + resetLink
                        + "\n\n"
                        + "This link will expire in 30 minutes.\n\n"
                        + "If you did not request a password reset, you can safely ignore this email.\n\n"
                        + "Regards,\n"
                        + "NexCart Team"
        );

        mailSender.send(message);
    }
}