package com.ping.controller.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExecuteRequest {
    private String filePath;
    private String content;
    private String language; // "python" or "java"
}
