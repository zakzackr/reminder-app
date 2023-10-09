package com.zakzackr.reminder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ReminderDto {
    private Long id;
    private String title;
    private String note;
    private LocalDateTime date;
}
