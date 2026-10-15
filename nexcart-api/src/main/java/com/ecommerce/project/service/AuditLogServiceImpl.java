package com.ecommerce.project.service;

import com.ecommerce.project.model.AuditLog;
import com.ecommerce.project.repositories.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.project.model.AuditLog;
import java.util.List;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void log(
            String action,
            String entityType,
            Long entityId,
            String description,
            String performedBy
    ) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLog.setPerformedBy(performedBy);

        auditLogRepository.save(auditLog);
    }

    @Override
    public List<AuditLog> getAllLogs() {

        return auditLogRepository.findAll(
                org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Direction.DESC,
                        "createdAt"
                )
        );
    }
}