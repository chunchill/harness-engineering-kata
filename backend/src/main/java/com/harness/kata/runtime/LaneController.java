package com.harness.kata.runtime;

import com.harness.kata.service.LaneService;
import com.harness.kata.types.LaneDto;
import com.harness.kata.types.LaneKey;
import com.harness.kata.types.LaneRenameRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lanes")
public class LaneController {

    private final LaneService laneService;

    public LaneController(LaneService laneService) {
        this.laneService = laneService;
    }

    @GetMapping
    public List<LaneDto> list() {
        return laneService.list();
    }

    @PatchMapping("/{key}")
    public ResponseEntity<LaneDto> rename(@PathVariable LaneKey key, @RequestBody LaneRenameRequest body) {
        try {
            return ResponseEntity.ok(laneService.rename(key, body != null ? body.name() : null));
        } catch (IllegalArgumentException e) {
            String msg = e.getMessage() != null ? e.getMessage() : "";
            if (msg.contains("not found")) return ResponseEntity.notFound().build();
            return ResponseEntity.badRequest().build();
        }
    }
}

