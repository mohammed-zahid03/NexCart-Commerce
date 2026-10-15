package com.ecommerce.project.repositories;

import com.ecommerce.project.model.ReturnRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ecommerce.project.payload.ReturnStatusAnalyticsDTO;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    Optional<ReturnRequest> findByOrderOrderId(Long orderId);

    List<ReturnRequest> findAllByOrderByRequestedAtDesc();

    @Query("""
    SELECT new com.ecommerce.project.payload.ReturnStatusAnalyticsDTO(
        r.status,
        COUNT(r)
    )
    FROM ReturnRequest r
    GROUP BY r.status
    ORDER BY COUNT(r) DESC
    """)
    List<ReturnStatusAnalyticsDTO> getReturnsByStatus();
}