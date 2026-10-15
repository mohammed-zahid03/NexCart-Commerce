package com.ecommerce.project.controller;

import com.ecommerce.project.model.AuditLog;
import com.ecommerce.project.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    @GetMapping("/admin/audit-logs")
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {

        List<AuditLog> logs =
                auditLogService.getAllLogs();

        return new ResponseEntity<>(
                logs,
                HttpStatus.OK
        );
    }
}