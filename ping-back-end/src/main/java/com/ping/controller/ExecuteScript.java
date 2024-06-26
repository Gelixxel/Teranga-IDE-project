package com.ping.controller;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;

public class ExecuteScript {

    public String executePythonScript(String filePath) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder("python3", filePath);
        Path root = Paths.get("../code");
        processBuilder.directory(new File(root.toString()));
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        process.waitFor();
        return output.toString();
    }

    public String executeJavaProgram(String filePath) throws IOException, InterruptedException {
        String className = new File(filePath).getName().replace(".java", "");
        Path root = Paths.get("../code");
        ProcessBuilder compileProcessBuilder = new ProcessBuilder("javac", filePath);
        compileProcessBuilder.directory(new File(root.toString()));
        compileProcessBuilder.redirectErrorStream(true);

        Process compileProcess = compileProcessBuilder.start();
        StringBuilder compileOutput = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(compileProcess.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                compileOutput.append(line).append("\n");
            }
        }

        compileProcess.waitFor();
        if (compileProcess.exitValue() != 0) {
            return "Compilation failed:\n" + compileOutput.toString();
        }

        ProcessBuilder runProcessBuilder = new ProcessBuilder("java", className);
        runProcessBuilder.directory(new File(root.toString()));
        runProcessBuilder.redirectErrorStream(true);

        Process runProcess = runProcessBuilder.start();
        StringBuilder runOutput = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                runOutput.append(line).append("\n");
            }
        }

        runProcess.waitFor();
        return runOutput.toString();
    }

}
