package com.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;

@Configuration
public class FirebaseConfig {


    public static void firebaseInit() throws IOException {
    	
    	if (FirebaseApp.getApps().isEmpty()) {
    		
//    	File file = new File(Objects.requireNonNull(ClassLoader.getSystemResource("serviceAccountKey.json").getFile()));
        FileInputStream serviceAccount = new FileInputStream("D:\\college\\SoftwareEngineering\\Project\\JobPortal\\Backend\\src\\main\\resources\\firebase\\serviceAccountKey.json");

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .setDatabaseUrl("https://inclusivejobportal-default-rtdb.firebaseio.com")
                .build();

        FirebaseApp.initializeApp(options);
    	}
    }
}
