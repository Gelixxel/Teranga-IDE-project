package com.ping.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

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
        logger.info("Root directory set to: {}", root);
    }

    @GetMapping("/message")
    public String getMessage() {
        return "Diop Bizarre IDE!";
    }

    @PostMapping("/open")
    public String openFile(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Opening file at path: {}", path);
        try {
            if (Files.isDirectory(path)) {
                logger.error("Path is a directory, not a file: {}", path);
                return "Error: Path is a directory, not a file: " + path;
            }
            if (!Files.exists(path)) {
                logger.error("File not found: {}", path);
                return "Error: File not found: " + path;
            }
            String content = Files.readString(path, StandardCharsets.UTF_8);
            logger.debug("File content read successfully");
            return content;
        } catch (IOException e) {
            logger.error("Error opening file at path: {}", path, e);
            return "Error opening file: " + e.getMessage();
        }
    }

    @PostMapping("/openDirectory")
    public List<FileInfo> openDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path directoryPath = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Exploring directory at path: {}", directoryPath);
        try {
            if (!Files.exists(directoryPath) || !Files.isDirectory(directoryPath)) {
                logger.error("Directory not found: {}", directoryPath);
                throw new IOException("Directory not found: " + directoryPath);
            }

            List<FileInfo> fileList = Files.list(directoryPath)
                    .map(path -> new FileInfo(path.getFileName().toString(), Files.isDirectory(path)))
                    .collect(Collectors.toList());
            logger.debug("Directory content: {}", fileList);
            return fileList;
        } catch (IOException e) {
            logger.error("Error exploring directory at path: {}", directoryPath, e);
            return List.of(); // Return an empty list in case of an error
        }
    }

    @PostMapping("/save")
    public String saveFile(@RequestBody FileSaveRequest fileSaveRequest) {
        Path path = root.resolve(fileSaveRequest.getFilePath()).normalize();
        logger.info("Saving file at path: {}", path);
        try {
            // Ensure parent directories exist
            if (path.getParent() != null) {
                Files.createDirectories(path.getParent());
                logger.debug("Parent directories created for path: {}", path);
            }

            // Write content to file with safe options
            Files.write(path, fileSaveRequest.getContent().getBytes(StandardCharsets.UTF_8), StandardOpenOption.CREATE,
                    StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE);
            logger.debug("File saved successfully at path: {}", path);
            return "File saved successfully!";
        } catch (IOException e) {
            logger.error("Error saving file at path: {}", path, e);
            return "Error saving file: " + e.getMessage();
        }
    }

    @PostMapping("/execute")
    public String execute(@RequestBody ExecuteRequest executeRequest) {
        Path path = root.resolve(executeRequest.getFilePath()).normalize();
        logger.info("Executing file at path: {}", path);
        try {
            Files.write(path, executeRequest.getContent().getBytes(StandardCharsets.UTF_8));
            logger.debug("File content written for execution at path: {}", path);

            String result;
            if ("python".equalsIgnoreCase(executeRequest.getLanguage())) {
                result = executeScript.executePythonScript(path.toString());
            } else if ("java".equalsIgnoreCase(executeRequest.getLanguage())) {
                result = executeScript.executeJavaProgram(path.toString());
            } else {
                result = "Unsupported language!";
            }
            logger.debug("Execution result: {}", result);
            return result;
        } catch (IOException | InterruptedException e) {
            logger.error("Error executing file at path: {}", path, e);
            return "Error executing file: " + e.getMessage();
        }
    }

    @PostMapping("/explore")
    public List<FileInfo> exploreDirectory(@RequestBody FileExplorerRequest fileExplorerRequest) {
        Path directoryPath = root.resolve(fileExplorerRequest.getDirectoryPath()).normalize();
        logger.info("Exploring directory at path: {}", directoryPath);
        try {
            if (!Files.exists(directoryPath) || !Files.isDirectory(directoryPath)) {
                logger.error("Directory not found: {}", directoryPath);
                throw new IOException("Directory not found: " + directoryPath);
            }

            List<FileInfo> fileList = Files.list(directoryPath)
                    .map(path -> new FileInfo(path.getFileName().toString(), Files.isDirectory(path)))
                    .collect(Collectors.toList());
            logger.debug("Directory content: {}", fileList);
            return fileList;
        } catch (IOException e) {
            logger.error("Error exploring directory at path: {}", directoryPath, e);
            return List.of(); // Return an empty list in case of an error
        }
    }

    @PostMapping("/create")
    public String createFileOrDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Creating file or directory at path: {}", path);
        try {
            if (Files.exists(path)) {
                throw new IOException("File or directory already exists: " + path);
            }
            if (filePathRequest.isDirectory()) {
                Files.createDirectories(path.getParent());
                logger.debug("Directory created at path: {}", path);
            } else {
                if (Files.notExists(path.getParent()))
                    Files.createDirectories(path.getParent());
                Files.createFile(path);
                logger.debug("File created at path: {}", path);
            }
            return "Created successfully!";
        } catch (IOException e) {
            logger.error("Error creating file or directory at path: {}", path, e);
            return "Error creating file or directory: " + e.getMessage();
        }
    }

    @PostMapping("/delete")
    public String deleteFileOrDirectory(@RequestBody FilePathRequest filePathRequest) {
        Path path = root.resolve(filePathRequest.getFilePath()).normalize();
        logger.info("Deleting file or directory at path: {}", path);
        try {
            if (!Files.exists(path)) {
                throw new IOException("File or directory does not exist: " + path);
            }
            Files.walk(path).sorted(Comparator.reverseOrder()).forEach(p -> {
                try {
                    if (Files.isDirectory(p) && Files.list(p).findAny().isEmpty()) {
                        Files.delete(p);
                        logger.debug("Deleted empty directory at path: {}", p);
                    } else {
                        Files.delete(p);
                        logger.debug("Deleted path: {}", p);
                    }
                } catch (IOException e) {
                    logger.error("Error deleting file or directory at path: {}", p, e);
                }
            });
            return "Deleted successfully!";
        } catch (IOException e) {
            logger.error("Error deleting file or directory at path: {}", path, e);
            return "Error deleting file or directory: " + e.getMessage();
        }
    }
}
