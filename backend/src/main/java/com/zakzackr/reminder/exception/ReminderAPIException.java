package com.zakzackr.reminder.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;

@AllArgsConstructor
@Getter
public class ReminderAPIException extends RuntimeException{
    private HttpStatus status;
    private String message;
}
