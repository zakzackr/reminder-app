package com.zakzackr.reminder.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public class ReminderAPIException extends RuntimeException{
    private HttpStatus status;
    private String message;
}
