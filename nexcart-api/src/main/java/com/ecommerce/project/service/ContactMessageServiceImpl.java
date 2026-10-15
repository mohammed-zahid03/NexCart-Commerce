package com.ecommerce.project.service;

import com.ecommerce.project.model.ContactMessage;
import com.ecommerce.project.payload.ContactMessageDTO;
import com.ecommerce.project.repositories.ContactMessageRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {

    private final ContactMessageRepository contactMessageRepository;
    private final ModelMapper modelMapper;

    public ContactMessageServiceImpl(
            ContactMessageRepository contactMessageRepository,
            ModelMapper modelMapper
    ) {
        this.contactMessageRepository = contactMessageRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public ContactMessageDTO createContactMessage(ContactMessageDTO contactMessageDTO) {

        ContactMessage contactMessage =
                modelMapper.map(contactMessageDTO, ContactMessage.class);

        ContactMessage savedMessage =
                contactMessageRepository.save(contactMessage);

        return modelMapper.map(savedMessage, ContactMessageDTO.class);
    }

    @Override
    public List<ContactMessageDTO> getAllContactMessages() {

        return contactMessageRepository.findAll()
                .stream()
                .map(message -> modelMapper.map(message, ContactMessageDTO.class))
                .toList();
    }
}