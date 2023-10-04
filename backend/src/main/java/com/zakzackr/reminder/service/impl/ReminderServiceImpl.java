package com.zakzackr.reminder.service.impl;

import com.zakzackr.reminder.dto.ReminderDto;
import com.zakzackr.reminder.entity.Reminder;
import com.zakzackr.reminder.entity.User;
import com.zakzackr.reminder.exception.ResourceNotFoundException;
import com.zakzackr.reminder.repository.ReminderRepository;
import com.zakzackr.reminder.repository.UserRepository;
import com.zakzackr.reminder.service.ReminderService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ReminderServiceImpl implements ReminderService {

    private ReminderRepository reminderRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    // constructor injection
//    public ReminderServiceImpl(ReminderRepository reminderRepository){
//        this.reminderRepository = reminderRepository;
//    }

    @Override
    public ReminderDto getReminder(Long userId, Long reminderId) {
        Reminder reminder = reminderRepository.findByIdAndUserId(userId, reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("The resource does not exist."));

        return modelMapper.map(reminder, ReminderDto.class);
    }

    @Override
    public List<ReminderDto> getAllReminders(Long userId) {
        List<Reminder> reminderDtos = reminderRepository.findAllByUserId(userId);

        return reminderDtos.stream().map(reminder -> modelMapper.map(reminder, ReminderDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public ReminderDto createReminder(Long userId, ReminderDto reminderDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("The resource does not exist."));

        Reminder reminder = modelMapper.map(reminderDto, Reminder.class);
        reminder.setUser(user);
        Reminder savedReminder = reminderRepository.save(reminder);

        return modelMapper.map(savedReminder, ReminderDto.class);
    }

    @Override
    public ReminderDto updateReminder(Long userId, Long reminderId, ReminderDto reminderDto) {
        Reminder reminder = reminderRepository.findByIdAndUserId(reminderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("The resource does not exist."));

        reminder.setTitle(reminderDto.getTitle());
        reminder.setNotes(reminderDto.getNote());
        reminder.setDate(reminderDto.getDate());
        Reminder updatedReminder = reminderRepository.save(reminder);

        return modelMapper.map(updatedReminder, ReminderDto.class);
    }

    @Override
    public void deleteReminder(Long userId, Long reminderId) {
        Reminder reminder = reminderRepository.findByIdAndUserId(reminderId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("The resource does not exist."));

        reminderRepository.deleteById(reminder.getId());
    }
}
