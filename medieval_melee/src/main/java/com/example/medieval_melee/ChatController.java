package com.example.medieval_melee;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

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
    
    private final List<ChatMessage> messages = new CopyOnWriteArrayList<>();
    private final AtomicInteger lastId = new AtomicInteger(0);

    @GetMapping
    public ChatResponse getMessages(@RequestParam(defaultValue = "0") int since) {
        List<String> newMessages = messages.stream()
                                           .filter(msg -> msg.id() > since)
                                           .map(ChatMessage::text)
                                           .toList();

        int latestId = newMessages.isEmpty() ? since : messages.get(messages.size() - 1).id();

        return new ChatResponse(newMessages, latestId);
    }

    @PostMapping
    public ResponseEntity<Void> postMessage(@RequestParam String message) {
        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        messages.add(new ChatMessage(lastId.incrementAndGet(), message.trim()));
        if (messages.size() > 50) {
            messages.remove(0);
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public static class ChatResponse {
        private final List<String> messages;
        private final int timestamp;

        public ChatResponse(List<String> messages, int timestamp) {
            this.messages = messages;
            this.timestamp = timestamp;
        }

        public List<String> getMessages() {
            return messages;
        }

        public int getTimestamp() {
            return timestamp;
        }
    }
}
