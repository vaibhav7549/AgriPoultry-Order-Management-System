package com.agripoultry.controller;

import com.agripoultry.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(required = false) String userId) {
        if (userId != null) {
            return ResponseEntity.ok(service.getByUser(userId));
        }
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{notifId}/read")
    public ResponseEntity<Map<String, Object>> markRead(@PathVariable String notifId) {
        return ResponseEntity.ok(service.markRead(notifId));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, String>> markAllRead(@RequestParam String userId) {
        service.markAllRead(userId);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
