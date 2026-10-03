package com.bmb.backend.controller;

import com.bmb.backend.entity.Booking;
import com.bmb.backend.repository.BookingRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;

    public BookingController(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // CREATE BOOKING
    @PostMapping("/bookings")
    public ResponseEntity<Booking> createBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        // JWT se logged-in user's email
        String userEmail = authentication.getName();

        // Booking ko logged-in user ke saath connect karo
        booking.setUserEmail(userEmail);

        // Initial payment/booking status
        booking.setPaymentStatus("SUCCESS");
        booking.setPaymentId("BMB-PAY-" + System.currentTimeMillis());
        booking.setBookingStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }


    // GET LOGGED-IN USER'S BOOKINGS
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getMyBookings(
            Authentication authentication) {

        String userEmail = authentication.getName();

        List<Booking> bookings =
                bookingRepository.findByUserEmail(userEmail);

        return ResponseEntity.ok(bookings);
    }


    // GET SINGLE BOOKING
    @GetMapping("/bookings/{id}")
    public ResponseEntity<?> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = authentication.getName();

        Booking booking = bookingRepository.findById(id)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Booking not found");
        }

        // User sirf apni booking dekh sakta hai
        if (!booking.getUserEmail().equals(userEmail)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to view this booking");
        }

        return ResponseEntity.ok(booking);
    }
   @GetMapping("/bookings/bus/{busId}/date/{journeyDate}/seats")
public ResponseEntity<List<String>> getBookedSeats(
        @PathVariable Long busId,
        @PathVariable String journeyDate) {

    List<Booking> bookings =
            bookingRepository.findByBusIdAndJourneyDate(
                    busId,
                    journeyDate
            );

    List<String> bookedSeats = bookings.stream()
            .flatMap(booking ->
                    List.of(booking.getSeats().split(",")).stream()
            )
            .map(String::trim)
            .toList();

    return ResponseEntity.ok(bookedSeats);
}
}