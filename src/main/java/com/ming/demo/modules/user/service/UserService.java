package com.ming.demo.modules.user.service;

import com.ming.demo.modules.user.entity.UserLogin;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserLogin findUserByName(String userMame) {
        return new UserLogin();
    }
}
