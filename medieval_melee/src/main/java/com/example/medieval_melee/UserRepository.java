package com.example.medieval_melee;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {
    private final String filePath = "users.json";
    private List<User> users;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserRepository() {
        try {
            File file = new File(filePath);
            if (file.exists()) {
                users = objectMapper.readValue(file, new TypeReference<List<User>>() {});
            } else {
                users = new ArrayList<>();
            }
        } catch (IOException e) {
            users = new ArrayList<>();
        }
    }

    public List<User> findAll() { return users; }

    public Optional<User> findByUsername(String username) {
        return users.stream().filter(user -> user.getUsername().equals(username)).findFirst();
    }

    public void save(User user) {
        users.removeIf(existingUser -> existingUser.getUsername().equals(user.getUsername()));
        users.add(user);
        persist();
    }

    public void deleteByUsername(String username) {
        users.removeIf(user -> user.getUsername().equals(username));
        persist();
    }

    private void persist() {
        try {
            objectMapper.writeValue(new File(filePath), users);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}