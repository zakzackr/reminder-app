package com.zakzackr.reminder.service;

import com.zakzackr.reminder.dto.ReminderDto;

import java.util.List;

public interface ReminderService {
    ReminderDto getReminder(Long userId, Long reminderId);

    List<ReminderDto> getAllReminders(Long userId);

    ReminderDto createReminder(Long userId, ReminderDto reminderDto);

    ReminderDto updateReminder(Long userId, Long reminderId, ReminderDto reminderDto);

    void deleteReminder(Long userId, Long reminderId);
}
