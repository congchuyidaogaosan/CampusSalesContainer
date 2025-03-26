package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.Product;
import com.domain.User;
import com.domain.query.FatherQuery;
import com.service.ProductService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/User")
@RestController
public class UserController {


    @Autowired
    private UserService productService;

    @GetMapping()
    public Result list(FatherQuery fatherQuery) {

        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (fatherQuery.getKeyword()!=null && !fatherQuery.getKeyword().equals("")){
            queryWrapper.eq("user_nickname",fatherQuery.getKeyword());
        }



        List<User> list = productService.list(queryWrapper);
        return Result.ok(list);
    }


    @PostMapping("save")
    public Result save(@RequestBody User product) {

        boolean save = productService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(@RequestBody User product) {

        boolean update = productService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {

        boolean byId = productService.removeById(id);
        return Result.ok();
    }


}
