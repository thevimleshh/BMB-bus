package com.bmb.backend.controller;

import com.bmb.backend.entity.BusSchedule;
import com.bmb.backend.repository.BusScheduleRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BusScheduleController {

    private final BusScheduleRepository busScheduleRepository;

    public BusScheduleController(BusScheduleRepository busScheduleRepository) {
        this.busScheduleRepository = busScheduleRepository;
    }

    @GetMapping("/bus-schedules")
    public List<BusSchedule> getAllSchedules() {
        return busScheduleRepository.findAll();
    }

    @PostMapping("/bus-schedules")
    public BusSchedule addSchedule(@RequestBody BusSchedule busSchedule) {
        return busScheduleRepository.save(busSchedule);
    }
}