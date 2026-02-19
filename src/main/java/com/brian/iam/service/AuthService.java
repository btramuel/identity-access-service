package com.brian.iam.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.brian.iam.dto.RegisterRequest;
import com.brian.iam.model.AppUser;
import com.brian.iam.model.Role;
import com.brian.iam.repository.RoleRepository;
import com.brian.iam.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void register(RegisterRequest req) {
        if (userRepo.existsByUsername(req.username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        if (userRepo.existsByEmail(req.email)) {
            throw new IllegalArgumentException("Email already in use");
        }

        Role roleUser = roleRepo.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("ROLE_USER not found"));

        AppUser user = new AppUser();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setPassword(passwordEncoder.encode(req.password));
        user.getRoles().add(roleUser);

        userRepo.save(user);
    }

@Transactional
public void registerAdmin(String username, String email, String rawPassword) {
    if (userRepo.existsByUsername(username)) {
        throw new IllegalArgumentException("Username already taken");
    }
    if (userRepo.existsByEmail(email)) {
        throw new IllegalArgumentException("Email already in use");
    }

    Role roleAdmin = roleRepo.findByName("ROLE_ADMIN")
            .orElseThrow(() -> new IllegalStateException("ROLE_ADMIN not found"));

    AppUser user = new AppUser();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(passwordEncoder.encode(rawPassword));
    user.getRoles().add(roleAdmin);

    userRepo.save(user);
 }
}