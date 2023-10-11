package com.zakzackr.reminder.service.email;

import com.zakzackr.reminder.entity.Reminder;
import com.zakzackr.reminder.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class EmailSenderService {
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String body){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("myservice.example@gmail.com");
        message.setTo(toEmail);
        message.setSubject("[Reminder] Register Confirmation Email");
        message.setText(body);

        mailSender.send(message);
        System.out.println("Email sent successfully...");
    }

    public void sendScheduledEmail(User user, Reminder reminder){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("myservice.example@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("[Reminder] " + reminder.getTitle());
        message.setText(reminder.getTitle() + ": \n" + reminder.getNote());
        mailSender.send(message);
    }
}
