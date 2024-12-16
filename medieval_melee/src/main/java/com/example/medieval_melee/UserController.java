package com.example.medieval_melee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public boolean login(@RequestParam String username, @RequestParam String password) {
        return userService.login(username, password).isPresent();
    }

    @PostMapping("/register")
    public boolean register(@RequestBody User user) {
        return userService.register(user);
    }

    @PutMapping("/updateGamesPlayed")
    public boolean updateGamesPlayed(@RequestParam String username, @RequestParam int gamesPlayed) {
        return userService.updateGamesPlayed(username, gamesPlayed);
    }

    @DeleteMapping("/delete")
    public boolean delete(@RequestParam String username) {
        return userService.delete(username);
    }
}
