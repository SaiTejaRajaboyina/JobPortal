package com.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import com.google.cloud.firestore.WriteResult;
import com.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

import com.respositoy.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String createUser(User user) {
        // Fire base logic for user creation
        return userRepository.createUser(user);
    }

    public String loginUser(String email, String password) {
        // Fire base logic for user login
        return userRepository.loginUser(email, password);
    }

    public String updateUser(User user) {
        // Fire base logic for user update
        return userRepository.updateUser(user);
    }
    
 
    

}
