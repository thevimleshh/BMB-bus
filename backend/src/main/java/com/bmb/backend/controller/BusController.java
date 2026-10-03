package com.bmb.backend.controller;

import com.bmb.backend.entity.Bus;
import com.bmb.backend.repository.BusRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class BusController {

    private final BusRepository busRepository;

    public BusController(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @GetMapping("/buses")
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }
    @PostMapping("/buses")
public Bus addBus(@RequestBody Bus bus) {
    return busRepository.save(bus);
}
}