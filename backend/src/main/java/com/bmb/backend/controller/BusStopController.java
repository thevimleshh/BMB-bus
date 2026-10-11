
package com.bmb.backend.controller;

import com.bmb.backend.entity.Bus;
import com.bmb.backend.entity.BusStop;
import com.bmb.backend.repository.BusRepository;
import com.bmb.backend.repository.BusStopRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://bmb-frontend.onrender.com"
})
public class BusStopController {

    private final BusRepository busRepository;
    private final BusStopRepository busStopRepository;

    public BusStopController(
            BusRepository busRepository,
            BusStopRepository busStopRepository) {
        this.busRepository = busRepository;
        this.busStopRepository = busStopRepository;
    }

    @GetMapping("/{busId}/stops")
    public List<BusStop> getBusStops(
            @PathVariable Long busId,
            @RequestParam String type) {

        if (!busRepository.existsById(busId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Bus not found"
            );
        }

        if (!type.equalsIgnoreCase("PICKUP")
                && !type.equalsIgnoreCase("DROP")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Type must be PICKUP or DROP"
            );
        }

        return busStopRepository
                .findByBusIdAndStopTypeIgnoreCase(busId, type);
    }

    @PostMapping("/{busId}/stops")
    public BusStop addBusStop(
            @PathVariable Long busId,
            @RequestBody BusStop stop) {

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bus not found"
                ));

        if (stop.getStopType() == null
                || (!stop.getStopType().equalsIgnoreCase("PICKUP")
                && !stop.getStopType().equalsIgnoreCase("DROP"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Type must be PICKUP or DROP"
            );
        }

        stop.setBus(bus);
        stop.setStopType(stop.getStopType().toUpperCase());

        return busStopRepository.save(stop);
    }
}
