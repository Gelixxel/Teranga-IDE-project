package com.ping;

import com.ping.model.Authority;
import com.ping.model.User;
import com.ping.repository.AuthorityRepository;
import com.ping.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Authority roleSuperAdmin = new Authority();
        roleSuperAdmin.setAuthority("ROLE_SUPER_ADMIN");

        Authority roleAdmin = new Authority();
        roleAdmin.setAuthority("ROLE_ADMIN");

        Authority roleUser = new Authority();
        roleUser.setAuthority("ROLE_USER");

        // Save the authorities first
        authorityRepository.save(roleSuperAdmin);
        authorityRepository.save(roleAdmin);
        authorityRepository.save(roleUser);

        // Create and save users
        User superAdmin = new User();
        superAdmin.setUsername("superadmin");
        superAdmin.setPassword(passwordEncoder.encode("superadminPass"));
        superAdmin.setAuthorities(Set.of(roleSuperAdmin));
        userRepository.save(superAdmin);

        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setAuthorities(Set.of(roleAdmin));
        userRepository.save(admin);

        User user = new User();
        user.setUsername("user");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setAuthorities(Set.of(roleUser));
        userRepository.save(user);
    }
}
