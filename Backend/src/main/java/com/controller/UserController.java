package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import com.model.User;
import com.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
	
    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public String createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        return userService.loginUser(email, password);
    }

    @PutMapping("/update")
    public String updateUser(@RequestBody User user) {
        return userService.updateUser(user);
    }


}
