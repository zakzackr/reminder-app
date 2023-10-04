package com.zakzackr.reminder.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

// Send error details to client
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorDetails {
    private LocalDateTime timeStamp;
    private String message;
    private String details;
}
