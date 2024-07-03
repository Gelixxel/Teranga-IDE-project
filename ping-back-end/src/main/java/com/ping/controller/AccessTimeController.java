package com.ping.controller;

import com.ping.model.TimeSlot;
import com.ping.service.AccessTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AccessTimeController {

    @Autowired
    private AccessTimeService accessTimeService;

    @PostMapping("/setBreakTime")
    public ResponseEntity<?> setBreakTime(@RequestBody Map<String, String> request) {
        LocalTime startTime = LocalTime.parse(request.get("startTime"));
        LocalTime endTime = LocalTime.parse(request.get("endTime"));

        accessTimeService.setGlobalBreakTime(startTime, endTime);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/getBreakTime")
    public ResponseEntity<TimeSlot> getBreakTime() {
        return ResponseEntity.ok(accessTimeService.getGlobalBreakTime());
    }
}
