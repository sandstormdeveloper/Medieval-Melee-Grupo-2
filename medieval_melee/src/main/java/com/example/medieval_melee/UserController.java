package com.example.medieval_melee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam String username) {
        Optional<User> user = userService.getUser(username);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("{\"error\": \"User not found\"}");
        }
    }

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
