package com.ping.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ping.model.User;
import com.ping.repository.UserRepository;

@Controller
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    @GetMapping("/isAdmin")
    public Map<String, Boolean> isAdmin(Authentication authentication) {
        if (authentication == null) {
            throw new IllegalArgumentException("Authentication is null");
        }

        boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))
                || authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));

        System.out.println("Authentication: " + authentication); // Log the authentication object
        System.out.println("Authorities: " + authentication.getAuthorities()); // Log the authorities

        return Collections.singletonMap("isAdmin", isAdmin);
    }

    @PostMapping("/validatePassword")
    public Map<String, Boolean> validatePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(username, password));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return Collections.singletonMap("valid", true);
        } catch (Exception e) {
            return Collections.singletonMap("valid", false);
        }
    }

    @GetMapping("/currentUsername")
    public Map<String, String> currentUsername(Authentication authentication) {
        return Collections.singletonMap("username", authentication.getName());
    }

    @GetMapping("/userDetails")
public ResponseEntity<Map<String, String>> getUserDetails(Authentication authentication) {
    String username = authentication.getName();
    User user = userRepository.findByUsername(username);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
    }
    Map<String, String> userDetails = Map.of(
        "username", user.getUsername(),
        "email", user.getEmail(),
        "phone", user.getPhone()
    );
    return ResponseEntity.ok(userDetails);
}


    @PutMapping("/updateUserDetails")
    public ResponseEntity<?> updateUserDetails(@RequestBody Map<String, String> userDetails, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
        }

        // Update user details
        user.setUsername(userDetails.get("username"));
        user.setEmail(userDetails.get("email"));
        user.setPhone(userDetails.get("phone"));

        userRepository.save(user);

        return ResponseEntity.ok(Collections.singletonMap("success", true));
    }

}
