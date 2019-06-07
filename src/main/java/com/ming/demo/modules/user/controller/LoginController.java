package com.ming.demo.modules.user.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginController {

    @RequestMapping("/admin/login")
    @ResponseBody
    public String loginFail(){
        return "登录失败。";
    }
}
