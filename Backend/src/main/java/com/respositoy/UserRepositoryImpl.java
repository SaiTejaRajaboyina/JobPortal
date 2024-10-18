package com.respositoy;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;
import com.google.firebase.auth.UserRecord.UpdateRequest;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.model.User;

import java.util.Map;

public class UserRepositoryImpl implements UserRepository{

	private final FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
    private final DatabaseReference databaseReference = FirebaseDatabase.getInstance().getReference("users");

    @Override
    public String createUser(User user) {
        CreateRequest request = new CreateRequest()
                .setEmail(user.getEmail())
                .setPassword(user.getPassword())
                .setDisplayName(user.getFirstName() + " " + user.getLastName())
                .setPhoneNumber(String.valueOf(user.getPhoneNumber()));
        try {
            UserRecord userRecord = firebaseAuth.createUser(request);
            user.setId(Long.parseLong(userRecord.getUid())); // Assuming UID can be parsed to long

            // Save other user details in Realtime Database
            databaseReference.child(userRecord.getUid()).setValueAsync(user);

            return "User created successfully with UID: " + userRecord.getUid();
        } catch (FirebaseAuthException e) {
            return "Error creating user: " + e.getMessage();
        }
    }

    @Override
    public String loginUser(String email, String password) {
        // Firebase Authentication for login is typically handled on the client side.
        // However, you can implement server-side verification using Firebase Admin SDK.
        // Here's a placeholder implementation.

        try {
            // Verify the user exists
            UserRecord userRecord = firebaseAuth.getUserByEmail(email);
            // In a real scenario, you would verify the password here.
            // Firebase Admin SDK doesn't support password verification.
            // Password verification should be done on the client side using Firebase Client SDK.
            return "Login successful for UID: " + userRecord.getUid();
        } catch (FirebaseAuthException e) {
            return "Error logging in user: " + e.getMessage();
        }
    }

    @Override
    public String updateUser(User user) {
        UpdateRequest request = new UpdateRequest( user.getId().toString())
                .setEmail(user.getEmail())
                .setPhoneNumber(String.valueOf(user.getPhoneNumber()))
                .setDisplayName(user.getFirstName() + " " + user.getLastName());
        try {
            UserRecord userRecord = firebaseAuth.updateUser(request);

            // Update user details in Realtime Database
            databaseReference.child(user.getId().toString()).updateChildrenAsync(Map.of(
                    "email", user.getEmail(),
                    "phoneNumber", user.getPhoneNumber(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName(),
                    "city", user.getCity(),
                    "country", user.getCountry(),
                    "pinCode", user.getPinCode(),
                    "state", user.getState(),
                    "street", user.getStreet()
            ));

            return "User updated successfully.";
        } catch (FirebaseAuthException e) {
            return "Error updating user: " + e.getMessage();
        }
    }
	
}
