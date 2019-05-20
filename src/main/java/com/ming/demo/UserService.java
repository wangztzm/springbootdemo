package com.ming.demo;

import org.springframework.stereotype.Service;

@Service
public class UserService {

    public User findUserByName(String userMame) {
        return new User();
    }
}
