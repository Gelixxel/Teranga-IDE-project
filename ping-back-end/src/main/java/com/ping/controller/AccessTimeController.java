package com.ping.controller;

import com.ping.model.TimeSlot;
import com.ping.service.AccessTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @PostMapping("/setBreakTimes")
    public Map<String, Boolean> setBreakTimes(@RequestBody List<Map<String, String>> request) {
        List<TimeSlot> timeSlots = request.stream()
                .map(breakTime -> new TimeSlot(null, LocalTime.parse(breakTime.get("startTime")), LocalTime.parse(breakTime.get("endTime"))))
                .collect(Collectors.toList());

        accessTimeService.setGlobalBreakTimes(timeSlots);
        return Map.of("success", true);
    }

    @GetMapping("/getBreakTimes")
    public List<Map<String, String>> getBreakTimes() {
        return accessTimeService.getGlobalBreakTimes().stream()
                .map(timeSlot -> Map.of(
                        "startTime", timeSlot.getStartTime().toString(),
                        "endTime", timeSlot.getEndTime().toString()
                ))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/deleteBreakTime")
    public Map<String, Boolean> deleteBreakTime() {
        accessTimeService.deleteGlobalBreakTime();
        return Map.of("success", true);
    }
}
