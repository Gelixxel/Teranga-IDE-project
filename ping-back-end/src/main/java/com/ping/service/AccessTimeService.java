package com.ping.service;

import org.springframework.stereotype.Service;

import com.ping.model.TimeSlot;
import com.ping.repository.TimeSlotRepository;
import com.ping.model.User;
import com.ping.repository.UserRepository;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AccessTimeService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;
    
    @Autowired
    private UserRepository userRepository;

    private TimeSlot globalBreakTime;

    private final Map<String, TimeSlot> accessRestrictions = new HashMap<>();

    // Method to set access restrictions for users
    public void setAccessTime(String username, LocalTime startTime, LocalTime endTime) {
        User user = userRepository.findByUsername(username);
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setUser(user);
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlotRepository.save(timeSlot);
        accessRestrictions.put(username, timeSlot);
    }


    public boolean isAccessAllowed(String username) {
        LocalTime now = LocalTime.now();
        // Check global break time
        if (globalBreakTime != null && isWithinBreakTime(now, globalBreakTime)) {
            return false;
        }
        return true;
    }

    // Method to set global break time
    public void setGlobalBreakTime(LocalTime startTime, LocalTime endTime) {
        this.globalBreakTime = new TimeSlot(null, startTime, endTime);
    }

    // Check if current time is within the break time
    private boolean isWithinBreakTime(LocalTime now, TimeSlot breakTime) {
        return !now.isBefore(breakTime.getStartTime()) && !now.isAfter(breakTime.getEndTime());
    }

    public TimeSlot getGlobalBreakTime() {
        return globalBreakTime;
    }
}
