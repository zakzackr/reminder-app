package com.zakzackr.reminder.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

@Entity
@Table(name = "reminders")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Reminder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    private String note;
    @Column(nullable = false)
    private ZonedDateTime date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
