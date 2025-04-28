package com.zakzackr.reminder.controller;

import com.zakzackr.reminder.dto.ReminderDto;
import com.zakzackr.reminder.service.ReminderService;
import lombok.AllArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.zakzackr.reminder.security.CustomUserDetails;

import java.util.List;

// @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

@RestController
@RequestMapping("/reminders")
@AllArgsConstructor
public class ReminderController {

    private ReminderService reminderService;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("/{reminderId}")
    public ResponseEntity<ReminderDto> getReminder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                @PathVariable Long reminderId){

        Long userId = userDetails.getUserId();
        ReminderDto reminderDto = reminderService.getReminder(userId, reminderId);
        return ResponseEntity.ok(reminderDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @GetMapping("")
    public ResponseEntity<List<ReminderDto>> getAllReminders(@AuthenticationPrincipal CustomUserDetails userDetails){
        Long userId = userDetails.getUserId();
        List<ReminderDto> reminderDtos = reminderService.getAllReminders(userId);

        return ResponseEntity.ok(reminderDtos);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("")
    public ResponseEntity<ReminderDto> addReminder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody ReminderDto newReminderDto){

        Long userId = userDetails.getUserId();

        ReminderDto reminderDto = reminderService.createReminder(userId, newReminderDto);
        return new ResponseEntity<>(reminderDto, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PutMapping("/{reminderId}")
    public ResponseEntity<ReminderDto> updateReminder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                    @PathVariable Long reminderId,
                                                    @RequestBody ReminderDto updatedReminderDto){
        
        Long userId = userDetails.getUserId();
        ReminderDto reminderDto = reminderService.updateReminder(userId, reminderId, updatedReminderDto);

        return ResponseEntity.ok(reminderDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @DeleteMapping("/{reminderId}")
    public ResponseEntity<String> deleteReminder(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                @PathVariable Long reminderId) {

        Long userId = userDetails.getUserId();
        reminderService.deleteReminder(userId, reminderId);

        return ResponseEntity.ok("Deleted successfully.");
    }
}





