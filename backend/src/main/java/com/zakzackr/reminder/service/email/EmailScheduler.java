package com.zakzackr.reminder.service.email;

import com.zakzackr.reminder.entity.Reminder;
import com.zakzackr.reminder.entity.User;
import com.zakzackr.reminder.repository.ReminderRepository;
import com.zakzackr.reminder.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EmailScheduler {

    private UserRepository userRepository;
    private ReminderRepository reminderRepository;
    private EmailSenderService senderService;

    @Scheduled(cron = "0 * * * * ?")
    public void checkAndSendScheduledEmails(){
        // convert to JPT

        // make second/nanosecond zero
        ZonedDateTime current = ZonedDateTime.now().truncatedTo(ChronoUnit.MINUTES);
        Optional<List<Reminder>> reminderOptional = reminderRepository.findByDate(current);

        if (reminderOptional.isPresent()){
            List<Reminder> scheduledReminders = reminderOptional.get();

            for (Reminder reminder: scheduledReminders){
                User user = reminder.getUser();
                senderService.sendScheduledEmail(user, reminder);
            }
        }
    }
}
