package com.example.medieval_melee;

public class User {
    private String username;
    private String password;
    private int gamesPlayed;

    public User() {}

    public User(String username, String password, int gamesPlayed) {
        this.username = username;
        this.password = password;
        this.gamesPlayed = gamesPlayed;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public int getGamesPlayed() { return gamesPlayed; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }
}

