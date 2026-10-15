package com.ecommerce.project.service;
import com.ecommerce.project.model.AuditLog;

import java.util.List;

public interface AuditLogService {

    void log(
            String action,
            String entityType,
            Long entityId,
            String description,
            String performedBy
    );

    List<AuditLog> getAllLogs();

}