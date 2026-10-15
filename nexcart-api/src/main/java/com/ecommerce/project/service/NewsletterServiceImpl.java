package com.ecommerce.project.service;

import com.ecommerce.project.model.Newsletter;
import com.ecommerce.project.repositories.NewsletterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterRepository newsletterRepository;

    @Override
    public void subscribe(String email) {

        String normalizedEmail = email.trim().toLowerCase();

        if (newsletterRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "This email is already subscribed."
            );
        }

        Newsletter newsletter = new Newsletter();
        newsletter.setEmail(normalizedEmail);

        newsletterRepository.save(newsletter);
    }
}