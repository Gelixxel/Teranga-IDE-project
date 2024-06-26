package com.ping.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.web.bind.annotation.*;

import com.ping.controller.Requests.FilePathRequest;
import com.ping.controller.Requests.FileSaveRequest;

@RestController
@RequestMapping("/api")
public class IDEController {

    @GetMapping("/message")
    public String getMessage() {
        return "Diop Bizarre IDE!";
    }

    private final Path root = Paths.get("../code");

    @PostMapping("/open")
    public String openFile(@RequestBody FilePathRequest filePathRequest) throws IOException {
        Path path = root.resolve(filePathRequest.getFilePath());
        return Files.readString(path, StandardCharsets.UTF_8);
    }

    @PostMapping("/save")
    public String saveFile(@RequestBody FileSaveRequest fileSaveRequest) throws IOException {
        Path path = root.resolve(fileSaveRequest.getFilePath());
        Files.write(path, fileSaveRequest.getContent().getBytes(StandardCharsets.UTF_8));
        return "File saved successfully!";
    }
}
