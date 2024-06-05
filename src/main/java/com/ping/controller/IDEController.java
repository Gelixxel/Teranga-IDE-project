package com.ping.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class IDEController {

    @GetMapping("/message")
    public String getMessage() {
        return "Diop Bizarre IDE!";
    }

    private final Path root = Paths.get("code");

    @PostMapping("/open")
    public String openFile(@RequestParam("filePath") String filePath) throws IOException {
        Path path = root.resolve(filePath);
        return Files.readString(path);
    }

    @PostMapping("/save")
    public String saveFile(@RequestParam("file") MultipartFile file, @RequestParam("filePath") String filePath) throws IOException {
        Path path = root.resolve(filePath);
        Files.write(path, file.getBytes());
        return "File saved successfully!";
    }
}
