package com.zakzackr.reminder.repository;

import com.zakzackr.reminder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
