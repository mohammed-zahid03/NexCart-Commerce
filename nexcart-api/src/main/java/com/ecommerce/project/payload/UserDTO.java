package com.ecommerce.project.payload;

import java.util.HashSet;
import java.util.Set;

import com.ecommerce.project.model.Role;

import com.ecommerce.project.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	
	private Long userId;
	private String username;
	private String email;
	private String password;
    private boolean sellerActive;
	private Set<Role> roles = new HashSet<>();
	private AddressDTO address;
	private CartDTO cart;

    private Long ordersCount;
    private Double totalSpent;
    private LocalDateTime createdAt;
    private boolean accountActive;
}
