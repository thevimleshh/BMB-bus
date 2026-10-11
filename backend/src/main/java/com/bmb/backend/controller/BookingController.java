
package com.bmb.backend.controller;

import com.bmb.backend.entity.Booking;
import com.bmb.backend.entity.BusStop;
import com.bmb.backend.repository.BookingRepository;
import com.bmb.backend.repository.BusStopRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final BusStopRepository busStopRepository;

    public BookingController(
            BookingRepository bookingRepository,
            BusStopRepository busStopRepository) {

        this.bookingRepository = bookingRepository;
        this.busStopRepository = busStopRepository;
    }

    // CREATE BOOKING
    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login before booking.");
        }

        // Required booking details
        if (booking.getBusId() == null
                || booking.getPickupStopId() == null
                || booking.getDropStopId() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Bus, pickup point and drop point are required.");
        }

        if (booking.getPickupStopId().equals(booking.getDropStopId())) {
            return ResponseEntity
                    .badRequest()
                    .body("Pickup and drop points must be different.");
        }

        // Find selected pickup and drop points
        BusStop pickup = busStopRepository
                .findById(booking.getPickupStopId())
                .orElse(null);

        BusStop drop = busStopRepository
                .findById(booking.getDropStopId())
                .orElse(null);

        if (pickup == null || drop == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Selected pickup or drop point was not found.");
        }

        // Both stops must belong to the selected bus
        if (pickup.getBus() == null
                || drop.getBus() == null
                || !booking.getBusId().equals(pickup.getBus().getId())
                || !booking.getBusId().equals(drop.getBus().getId())) {

            return ResponseEntity
                    .badRequest()
                    .body("Selected stops do not belong to this bus.");
        }

        // Verify stop types
        if (!"PICKUP".equalsIgnoreCase(pickup.getStopType())
                || !"DROP".equalsIgnoreCase(drop.getStopType())) {

            return ResponseEntity
                    .badRequest()
                    .body("Please select a valid pickup and drop point.");
        }

        // Attach the authenticated user to the booking
        booking.setUserEmail(authentication.getName());

        // Set booking and payment status
        booking.setPaymentStatus("SUCCESS");

        if (booking.getPaymentId() == null
                || booking.getPaymentId().isBlank()) {
            booking.setPaymentId(
                    "BMB-PAY-" + System.currentTimeMillis()
            );
        }

        booking.setBookingStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        return ResponseEntity.ok(savedBooking);
    }

    // GET LOGGED-IN USER'S BOOKINGS
    @GetMapping("/bookings")
    public ResponseEntity<?> getMyBookings(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first.");
        }

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

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Please login first.");
        }

        String userEmail = authentication.getName();

        Booking booking = bookingRepository.findById(id)
                .orElse(null);

        if (booking == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("Booking not found");
        }

        if (booking.getUserEmail() == null
                || !booking.getUserEmail().equals(userEmail)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to view this booking");
        }

        return ResponseEntity.ok(booking);
    }

    // GET BOOKED SEATS FOR A BUS AND JOURNEY DATE
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
                .filter(booking -> booking.getSeats() != null)
                .flatMap(booking ->
                        List.of(booking.getSeats().split(",")).stream()
                )
                .map(String::trim)
                .toList();

        return ResponseEntity.ok(bookedSeats);
    }
}
