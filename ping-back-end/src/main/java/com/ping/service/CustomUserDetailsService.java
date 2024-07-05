package com.ping.service;

import com.ping.model.Authority;
import com.ping.model.User;
import com.ping.repository.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        UserBuilder builder = org.springframework.security.core.userdetails.User.withUsername(username);
        builder.password(user.getPassword());
        builder.roles(user.getAuthorities().stream().map(a -> a.getAuthority().replace("ROLE_", "")).toArray(String[]::new));
        return builder.build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean promoteUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.getAuthorities().add(new Authority("ROLE_ADMIN"));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean demoteUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.getAuthorities().removeIf(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
            userRepository.save(user);
            return true;
        }
        return false;
    }

}
