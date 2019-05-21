package com.ming.demo.modules.user.mapper;

import com.ming.demo.modules.user.entity.UserLogin;

public interface UserLoginMapper {
    int insert(UserLogin record);

    int insertSelective(UserLogin record);
}