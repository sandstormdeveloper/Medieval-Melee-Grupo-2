package com.example.medieval_melee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password));
    }

    public boolean register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return false;
        }
        userRepository.save(user);
        return true;
    }

    public boolean updateGamesPlayed(String username, int gamesPlayed) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setGamesPlayed(gamesPlayed);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean delete(String username) {
        if (userRepository.findByUsername(username).isPresent()) {
            userRepository.deleteByUsername(username);
            return true;
        }
        return false;
    }
}
