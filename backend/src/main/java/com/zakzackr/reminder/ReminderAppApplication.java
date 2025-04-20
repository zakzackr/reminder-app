package com.zakzackr.reminder;

import org.modelmapper.ModelMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.zakzackr.reminder.entity.Role;
import com.zakzackr.reminder.repository.RoleRepository;

@SpringBootApplication
@EnableScheduling
public class ReminderAppApplication {

	@Bean
	public ModelMapper modelMapper(){
		return new ModelMapper();
	}

	@Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.findByRole("ROLE_ADMIN") == null) {
                roleRepository.save(new Role(1L, "ROLE_ADMIN"));
            }
            if (roleRepository.findByRole("ROLE_USER") == null) {
                roleRepository.save(new Role(2L, "ROLE_USER"));
            }
        };
    }

	public static void main(String[] args) {
		SpringApplication.run(ReminderAppApplication.class, args);
	}

}
