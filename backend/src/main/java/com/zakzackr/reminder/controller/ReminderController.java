package com.zakzackr.reminder.controller;

import com.zakzackr.reminder.dto.ReminderDto;
import com.zakzackr.reminder.entity.Reminder;
import com.zakzackr.reminder.repository.ReminderRepository;
import com.zakzackr.reminder.service.ReminderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/reminder")
@AllArgsConstructor
public class ReminderController {

    private ReminderService reminderService;

    @GetMapping("{userId}/{reminderId}")
    public ResponseEntity<ReminderDto> getReminder(@PathVariable Long userId,
                                                   @PathVariable Long reminderId){

        ReminderDto reminderDto = reminderService.getReminder(userId, reminderId);
        return ResponseEntity.ok(reminderDto);
    }

    @GetMapping("{userId}")
    public ResponseEntity<List<ReminderDto>> getAllReminders(@PathVariable Long userId){
        List<ReminderDto> reminderDtos = reminderService.getAllReminders(userId);
        return ResponseEntity.ok(reminderDtos);
    }

    @PostMapping("{userId}")
    public ResponseEntity<ReminderDto> addReminder(@PathVariable Long userId,
                                                   @RequestBody ReminderDto newReminderDto){

        ReminderDto reminderDto = reminderService.createReminder(userId, newReminderDto);
        return new ResponseEntity<>(reminderDto, HttpStatus.CREATED);
    }

    @PutMapping("{userId}/{reminderId}")
    public ResponseEntity<ReminderDto> updateReminder(@PathVariable Long userId,
                                                      @PathVariable Long reminderId,
                                                      @RequestBody ReminderDto updatedReminderDto){

        ReminderDto reminderDto = reminderService.updateReminder(userId, reminderId, updatedReminderDto);

        return ResponseEntity.ok(reminderDto);
    }

    @DeleteMapping("{userId}/{reminderId}")
    public ResponseEntity<String> deleteReminder(@PathVariable Long userId,
                                                 @PathVariable Long reminderId) {

        reminderService.deleteReminder(userId, reminderId);

        return ResponseEntity.ok("Deleted successfully.");
    }
}


