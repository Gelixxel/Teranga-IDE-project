package com.ping.controller.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilePathRequest {
    private String filePath;
    private boolean isDirectory;
}
