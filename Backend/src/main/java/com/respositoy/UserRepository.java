package com.respositoy;

import com.model.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository {
	
	    String createUser(User user);
	    String loginUser(String email, String password);
	    String updateUser(User user);
}
