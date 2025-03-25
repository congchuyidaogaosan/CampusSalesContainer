package com.controller;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.Admin;
import com.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/AdminLogin")
@RestController
public class AdminLoginController {


    @Autowired
    private AdminService adminService;


    @PostMapping("login")
    public Result login(@RequestBody Admin admin){

        QueryWrapper<Admin> eq = new QueryWrapper<Admin>().eq("admin_account", admin.getAdminAccount()).eq("admin_password", admin.getAdminPassword());
        Admin one = adminService.getOne(eq);
        return Result.ok(one);
    }
}
