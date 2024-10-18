package com.example.demo;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.config.FirebaseConfig;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) throws IOException {
		
		
		FirebaseConfig.firebaseInit();
		SpringApplication.run(BackendApplication.class, args);
	}

}
