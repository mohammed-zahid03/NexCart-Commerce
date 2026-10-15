package com.ecommerce.project.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AddressAccessDeniedException extends RuntimeException {

    public AddressAccessDeniedException(String message) {
        super(message);
    }
}