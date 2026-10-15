package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {

    boolean existsByEmail(String email);
}