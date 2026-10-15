package com.ecommerce.project.controller;

import com.ecommerce.project.payload.ContactMessageDTO;
import com.ecommerce.project.service.ContactMessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactMessageDTO> createContactMessage(
            @Valid @RequestBody ContactMessageDTO contactMessageDTO
    ) {
        ContactMessageDTO savedMessage =
                contactMessageService.createContactMessage(contactMessageDTO);

        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }

    @GetMapping("/admin/contact-messages")
    public ResponseEntity<List<ContactMessageDTO>> getAllContactMessages() {

        List<ContactMessageDTO> messages =
                contactMessageService.getAllContactMessages();

        return new ResponseEntity<>(messages, HttpStatus.OK);
    }
}