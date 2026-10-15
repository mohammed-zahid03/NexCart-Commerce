package com.ecommerce.project.repositories;

import com.ecommerce.project.model.AppRole;
import com.ecommerce.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUserName(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUserName(String username);

    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.roleName = :role")
    Page<User> findByRoleName(
            @Param("role") AppRole role,
            Pageable pageable
    );

    @Query("""
        SELECT DISTINCT u
        FROM User u
        JOIN u.roles r
        WHERE r.roleName = :userRole
        AND NOT EXISTS (
            SELECT 1
            FROM User admin
            JOIN admin.roles adminRole
            WHERE admin.userId = u.userId
            AND adminRole.roleName = :adminRole
        )
        """)
    Page<User> findCustomers(
            @Param("userRole") AppRole userRole,
            @Param("adminRole") AppRole adminRole,
            Pageable pageable
    );

    @Query("""
    SELECT COUNT(DISTINCT u)
    FROM User u
    JOIN u.roles r
    WHERE r.roleName = :role
    """)
    long countByRoleName(@Param("role") AppRole role);

    List<User> findAllByRoles_RoleName(AppRole role);

}
