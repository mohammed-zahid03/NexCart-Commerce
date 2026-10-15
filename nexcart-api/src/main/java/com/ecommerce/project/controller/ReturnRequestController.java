package com.ecommerce.project.controller;

import com.ecommerce.project.payload.ReturnRequestDTO;
import com.ecommerce.project.service.ReturnRequestService;
import com.ecommerce.project.util.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReturnRequestController {

    @Autowired
    private ReturnRequestService returnRequestService;

    @Autowired
    private AuthUtil authUtil;


    // =========================================================
    // CUSTOMER - CREATE RETURN REQUEST
    // =========================================================

    @PostMapping("/order/users/orders/{orderId}/return")
    public ResponseEntity<ReturnRequestDTO> createReturnRequest(
            @PathVariable Long orderId,
            @RequestBody ReturnRequestDTO returnRequestDTO
    ) {

        String emailId = authUtil.loggedInEmail();

        ReturnRequestDTO returnRequest =
                returnRequestService.createReturnRequest(
                        orderId,
                        emailId,
                        returnRequestDTO.getReason()
                );

        return new ResponseEntity<>(
                returnRequest,
                HttpStatus.CREATED
        );
    }


    // =========================================================
    // CUSTOMER - GET RETURN REQUEST FOR AN ORDER
    // =========================================================

    @GetMapping("/order/users/orders/{orderId}/return")
    public ResponseEntity<ReturnRequestDTO> getReturnRequest(
            @PathVariable Long orderId
    ) {

        String emailId = authUtil.loggedInEmail();

        ReturnRequestDTO returnRequest =
                returnRequestService.getReturnRequest(orderId, emailId);

        return new ResponseEntity<>(
                returnRequest,
                HttpStatus.OK
        );
    }


    // =========================================================
    // CUSTOMER - GET ALL THEIR RETURN REQUESTS
    // =========================================================

    @GetMapping("/order/users/returns")
    public ResponseEntity<List<ReturnRequestDTO>> getUserReturnRequests() {

        String emailId = authUtil.loggedInEmail();

        List<ReturnRequestDTO> returnRequests =
                returnRequestService.getUserReturnRequests(
                        emailId
                );

        return new ResponseEntity<>(
                returnRequests,
                HttpStatus.OK
        );
    }


    // =========================================================
    // ADMIN - GET ALL RETURN REQUESTS
    // =========================================================

    @GetMapping("/admin/returns")
    public ResponseEntity<List<ReturnRequestDTO>> getAllReturnRequests() {

        List<ReturnRequestDTO> returnRequests =
                returnRequestService.getAllReturnRequests();

        return new ResponseEntity<>(
                returnRequests,
                HttpStatus.OK
        );
    }


    // =========================================================
    // ADMIN - APPROVE / REJECT RETURN REQUEST
    // =========================================================

    @PutMapping("/admin/returns/{returnId}/status")
    public ResponseEntity<ReturnRequestDTO> updateReturnRequestStatus(
            @PathVariable Long returnId,
            @RequestParam String status
    ) {

        ReturnRequestDTO returnRequest =
                returnRequestService.updateReturnRequestStatus(
                        returnId,
                        status
                );

        return new ResponseEntity<>(
                returnRequest,
                HttpStatus.OK
        );
    }
}