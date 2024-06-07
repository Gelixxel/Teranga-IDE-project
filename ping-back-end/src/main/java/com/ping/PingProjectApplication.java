package com.ping;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PingProjectApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(PingProjectApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Spring Boot application has started.");
    }
}
