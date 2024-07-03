package com.ping.model;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalTime startTime;
    private LocalTime endTime;

    // Constructor with startTime and endTime
    public TimeSlot(User user, LocalTime startTime, LocalTime endTime) {
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
