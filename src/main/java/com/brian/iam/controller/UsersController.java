package com.brian.iam.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public String listUsers() {
        return "USER_READ allowed ✅";
    }

    @PostMapping
    @PreAuthorize("hasAuthority('USER_WRITE')")
    public String createUser() {
        return "USER_WRITE allowed ✅";
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public String deleteUser(@PathVariable long id) {
        return "USER_DELETE allowed ✅";
    }
}
