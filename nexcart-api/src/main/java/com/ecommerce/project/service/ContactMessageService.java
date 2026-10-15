package com.ecommerce.project.service;

import com.ecommerce.project.payload.ContactMessageDTO;

import java.util.List;

public interface ContactMessageService {

    ContactMessageDTO createContactMessage(ContactMessageDTO contactMessageDTO);

    List<ContactMessageDTO> getAllContactMessages();
}
