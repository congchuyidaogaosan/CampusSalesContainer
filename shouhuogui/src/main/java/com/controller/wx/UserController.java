package com.controller.wx;

import com.admin.Result;
import com.domain.Product;
import com.domain.User;
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
    public Result list() {

        List<User> list = productService.list();
        return Result.ok(list);
    }


    @PostMapping("save")
    public Result save(User product) {

        boolean save = productService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(User product) {

        boolean update = productService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {

        boolean byId = productService.removeById(id);
        return Result.ok();
    }


}
