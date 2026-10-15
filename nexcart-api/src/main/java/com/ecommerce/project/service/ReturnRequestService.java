package com.ecommerce.project.service;

import com.ecommerce.project.payload.ReturnRequestDTO;

import java.util.List;

public interface ReturnRequestService {

    ReturnRequestDTO createReturnRequest(
            Long orderId,
            String emailId,
            String reason
    );

    ReturnRequestDTO getReturnRequest(Long orderId, String emailId);

    List<ReturnRequestDTO> getUserReturnRequests(String emailId);

    List<ReturnRequestDTO> getAllReturnRequests();

    ReturnRequestDTO updateReturnRequestStatus(
            Long returnId,
            String status
    );
}