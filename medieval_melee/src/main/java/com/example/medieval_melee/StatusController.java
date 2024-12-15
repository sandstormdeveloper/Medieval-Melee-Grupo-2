package com.example.medieval_melee;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    private final AtomicInteger connectedUsers = new AtomicInteger(0);

    @GetMapping
    public Map<String, Object> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Conectado");
        response.put("connectedUsers", connectedUsers.get());
        return response;
    }

    @PostMapping("/increment")
    public void incrementUsers() {
        connectedUsers.incrementAndGet();
    }

    @PostMapping("/decrement")
    public void decrementUsers() {
        connectedUsers.decrementAndGet();
    }
}
