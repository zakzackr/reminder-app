package com.zakzackr.reminder.repository;

import com.zakzackr.reminder.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    Optional<Reminder> findByIdAndUserId(Long reminderId, Long userId);

    List<Reminder> findAllByUserId(Long userId);

    Optional<List<Reminder>> findByDate(ZonedDateTime date);
}
