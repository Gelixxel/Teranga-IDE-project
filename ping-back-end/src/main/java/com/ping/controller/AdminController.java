package com.ping.controller;

import com.ping.model.User;
import com.ping.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    @PostMapping("/setAccessTime")
    public String setAccessTime(@RequestParam String username,
                                @RequestParam String startTime,
                                @RequestParam String endTime) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return "User not found";
        }

        userRepository.save(user);

        return "Access time updated successfully";
    }
}
