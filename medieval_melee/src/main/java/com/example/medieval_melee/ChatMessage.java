package com.example.medieval_melee;

public record ChatMessage(int id, String text, long timestamp) {
    public ChatMessage(int id, String text) {
        this(id, text, System.currentTimeMillis());
    }
}
