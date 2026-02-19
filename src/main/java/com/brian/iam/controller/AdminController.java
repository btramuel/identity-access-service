package com.brian.iam.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.brian.iam.model.AppUser;
import com.brian.iam.model.Role;
import com.brian.iam.repository.RoleRepository;
import com.brian.iam.repository.UserRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;

    public AdminController(UserRepository userRepo, RoleRepository roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    @PostMapping("/users/{username}/roles/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<String> addRoleToUser(@PathVariable String username,
                                               @PathVariable String roleName) {

        AppUser user = userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String normalized = roleName.startsWith("ROLE_") ? roleName : "ROLE_" + roleName;

        Role role = roleRepo.findByName(normalized)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        user.getRoles().add(role);
        userRepo.save(user);

        return ResponseEntity.ok("Added " + normalized + " to " + username);
    }
}
