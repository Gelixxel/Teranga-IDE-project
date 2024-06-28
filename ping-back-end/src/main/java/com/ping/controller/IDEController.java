package com.ping.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ping.controller.Requests.ExecuteRequest;
import com.ping.controller.Requests.FileExplorerRequest;
import com.ping.controller.Requests.FilePathRequest;
import com.ping.controller.Requests.FileSaveRequest;
import com.ping.controller.Responses.FileInfo;

@RestController
@RequestMapping("/api")
public class IDEController {

    private static final Logger logger = LoggerFactory.getLogger(IDEController.class);
    private final ExecuteScript executeScript = new ExecuteScript();
    private final Path root;

    public IDEController() {
        String userHome = System.getProperty("user.home");
        root = Paths.get(userHome, "myIDE", "code").normalize().toAbsolutePath();
        logger.info("Root directory set to: " + root.toString());
    }

    @GetMapping("/message")
    public String getMessage() {
        return "Diop Bizarre IDE!";
    }

    @PostMapping("/open")
    public String openFile(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Opening file at path: " + path.toString());
        try {
            if (Files.isDirectory(path)) {
                logger.error("Path is a directory, not a file: " + path.toString());
                return "Error: Path is a directory, not a file: " + path.toString();
            }
            if (!Files.exists(path)) {
                logger.error("File not found: " + path.toString());
                return "Error: File not found: " + path.toString();
            }
            return Files.readString(path, StandardCharsets.UTF_8);
        } catch (IOException e) {
            logger.error("Error opening file at path: " + path.toString(), e);
            return "Error opening file: " + e.getMessage();
        }
    }

    @PostMapping("/openDirectory")
    public List<FileInfo> openDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path directoryPath = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Exploring directory at path: " + directoryPath.toString());
        try {
            if (!Files.exists(directoryPath) || !Files.isDirectory(directoryPath)) {
                logger.error("Directory not found: " + directoryPath.toString());
                throw new IOException("Directory not found: " + directoryPath.toString());
            }

            return Files.list(directoryPath)
                    .map(path -> new FileInfo(path.getFileName().toString(), Files.isDirectory(path)))
                    .collect(Collectors.toList());
        } catch (IOException e) {
            logger.error("Error exploring directory at path: " + directoryPath.toString(), e);
            return List.of(); // Return an empty list in case of an error
        }
    }

    @PostMapping("/save")
    public String saveFile(@RequestBody FileSaveRequest fileSaveRequest) {
        Path path = root.resolve(fileSaveRequest.getFilePath()).normalize();
        logger.info("Saving file at path: " + path.toString());
        try {
            // Ensure parent directories exist
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
            }

            // Write content to file with safe options
            Files.write(path, fileSaveRequest.getContent().getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);

            return "File saved successfully!";
        } catch (IOException e) {
            logger.error("Error saving file at path: " + path.toString(), e);
            return "Error saving file: " + e.getMessage();
        }
    }

    @PostMapping("/execute")
    public String execute(@RequestBody ExecuteRequest executeRequest) {
        Path path = root.resolve(executeRequest.getFilePath()).normalize();
        logger.info("Executing file at path: " + path.toString());
        try {
            Files.write(path, executeRequest.getContent().getBytes(StandardCharsets.UTF_8));

            if ("python".equalsIgnoreCase(executeRequest.getLanguage())) {
                return executeScript.executePythonScript(path.toString());
            } else if ("java".equalsIgnoreCase(executeRequest.getLanguage())) {
                return executeScript.executeJavaProgram(path.toString());
            }
            return "Unsupported language!";
        } catch (IOException | InterruptedException e) {
            logger.error("Error executing file at path: " + path.toString(), e);
            return "Error executing file: " + e.getMessage();
        }
    }

    @PostMapping("/explore")
    public List<FileInfo> exploreDirectory(@RequestBody FileExplorerRequest fileExplorerRequest) {
        Path directoryPath = root.resolve(fileExplorerRequest.getDirectoryPath()).normalize();
        logger.info("Exploring directory at path: " + directoryPath.toString());
        try {
            if (!Files.exists(directoryPath) || !Files.isDirectory(directoryPath)) {
                logger.error("Directory not found: " + directoryPath.toString());
                throw new IOException("Directory not found: " + directoryPath.toString());
            }
    
            return Files.list(directoryPath)
                        .map(path -> new FileInfo(path.getFileName().toString(), Files.isDirectory(path)))
                        .collect(Collectors.toList());
        } catch (IOException e) {
            logger.error("Error exploring directory at path: " + directoryPath.toString(), e);
            return List.of(); // Return an empty list in case of an error
        }
    }

    @PostMapping("/create")
    public String createFileOrDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Creating file or directory at path: " + path.toString());
        try {
            if (Files.exists(path)) {
                throw new IOException("File or directory already exists: " + path.toString());
            }
            if (filePathRequest.isDirectory()) {
                Files.createDirectories(path);
            } else {
                Files.createFile(path);
            }
            return "Created successfully!";
        } catch (IOException e) {
            logger.error("Error creating file or directory at path: " + path.toString(), e);
            return "Error creating file or directory: " + e.getMessage();
        }
    }

    @PostMapping("/delete")
    public String deleteFileOrDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Deleting file or directory at path: " + path.toString());
        try {
            if (!Files.exists(path)) {
                throw new IOException("File or directory does not exist: " + path.toString());
            }
            Files.walk(path).sorted(Comparator.reverseOrder()).forEach(p -> {
                try {
                    Files.delete(p);
                } catch (IOException e) {
                    logger.error("Error deleting file or directory at path: " + p.toString(), e);
                }
            });
            return "Deleted successfully!";
        } catch (IOException e) {
            logger.error("Error deleting file or directory at path: " + path.toString(), e);
            return "Error deleting file or directory: " + e.getMessage();
        }
    }
}
