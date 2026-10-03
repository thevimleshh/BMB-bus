package com.bmb.backend.repository;

import com.bmb.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByBusIdAndJourneyDate(
            Long busId,
            String journeyDate
    );
}