package com.example.medieval_melee;

import java.util.List;
import java.util.Queue;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final Queue<ChatMessage> messages = new ConcurrentLinkedQueue<>();
    private final AtomicInteger lastId = new AtomicInteger(0);
    private static final int MAX_MESSAGES = 50;

    @GetMapping
    public ChatResponse getMessages(@RequestParam(defaultValue = "0") long since) {
        List<String> newMessages = messages.stream()
                                           .filter(msg -> msg.timestamp() > since)
                                           .map(ChatMessage::text)
                                           .collect(Collectors.toList());

        long latestTimestamp = newMessages.isEmpty() ? since : messages.stream()
                                                                       .mapToLong(ChatMessage::timestamp)
                                                                       .max()
                                                                       .orElse(since);

        return new ChatResponse(newMessages, latestTimestamp);
    }

    @PostMapping
    public ResponseEntity<Void> postMessage(@RequestParam String message) {
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        synchronized (messages) {
            if (messages.size() >= MAX_MESSAGES) {
                messages.poll();
            }
            messages.add(new ChatMessage(lastId.incrementAndGet(), message.trim()));
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public static class ChatResponse {
        private final List<String> messages;
        private final long timestamp;

        public ChatResponse(List<String> messages, long timestamp) {
            this.messages = messages;
            this.timestamp = timestamp;
        }

        public List<String> getMessages() {
            return messages;
        }

        public long getTimestamp() {
            return timestamp;
        }
    }
}