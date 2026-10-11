
package com.bmb.backend.repository;

import com.bmb.backend.entity.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusStopRepository extends JpaRepository<BusStop, Long> {

    List<BusStop> findByBusIdAndStopTypeIgnoreCase(
            Long busId,
            String stopType
    );
}
