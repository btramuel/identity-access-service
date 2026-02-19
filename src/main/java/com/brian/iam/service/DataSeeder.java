package com.brian.iam.service;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.brian.iam.model.Permission;
import com.brian.iam.model.Role;
import com.brian.iam.repository.PermissionRepository;
import com.brian.iam.repository.RoleRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepo;
    private final PermissionRepository permRepo;

    public DataSeeder(RoleRepository roleRepo, PermissionRepository permRepo) {
        this.roleRepo = roleRepo;
        this.permRepo = permRepo;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Permissions
        Permission userRead = permRepo.findByName("USER_READ")
                .orElseGet(() -> permRepo.save(new Permission("USER_READ")));
        Permission userWrite = permRepo.findByName("USER_WRITE")
                .orElseGet(() -> permRepo.save(new Permission("USER_WRITE")));
        Permission userDelete = permRepo.findByName("USER_DELETE")
                .orElseGet(() -> permRepo.save(new Permission("USER_DELETE")));

        // Roles
        Role admin = roleRepo.findByName("ROLE_ADMIN")
                .orElseGet(() -> roleRepo.save(new Role("ROLE_ADMIN")));
        admin.getPermissions().addAll(Set.of(userRead, userWrite, userDelete));
        roleRepo.save(admin);

        Role user = roleRepo.findByName("ROLE_USER")
                .orElseGet(() -> roleRepo.save(new Role("ROLE_USER")));
        user.getPermissions().add(userRead);
        roleRepo.save(user);
    }
}
