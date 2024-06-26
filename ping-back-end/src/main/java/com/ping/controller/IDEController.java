package com.ping.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.ping.controller.Requests.FileSaveRequest;
import com.ping.controller.Requests.FilePathRequest;
import com.ping.controller.Requests.ExecuteRequest;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class IDEController {

    private final Path root = Paths.get("../code");
    private final ExecuteScript executeScript = new ExecuteScript();

    @GetMapping("/message")
    public String getMessage() {
        return "Diop Bizarre IDE!";
    }

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

    @PostMapping("/execute")
    public String execute(@RequestBody ExecuteRequest executeRequest) throws IOException, InterruptedException {
        Path path = root.resolve(executeRequest.getFilePath());
        Files.write(path, executeRequest.getContent().getBytes(StandardCharsets.UTF_8));

        if ("python".equalsIgnoreCase(executeRequest.getLanguage())) {
            return executeScript.executePythonScript(path.toString());
        } else if ("java".equalsIgnoreCase(executeRequest.getLanguage())) {
            return executeScript.executeJavaProgram(path.toString());
        }
        return "Unsupported language!";
    }
}
