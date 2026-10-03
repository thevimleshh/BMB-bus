package com.bmb.backend.repository;

import com.bmb.backend.entity.BusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusScheduleRepository extends JpaRepository<BusSchedule, Long> {
}