package com.controller.wx;

import com.admin.Result;
import com.domain.Product;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/Product")
@RestController
public class ProductController {


    @Autowired
    private ProductService productService;

    @GetMapping()
    public Result list() {

        List<Product> list = productService.list();
        return Result.ok(list);
    }

    @GetMapping("{id}")
    public Result find(@PathVariable("id")Integer id) {

        Product byId = productService.getById(id);
        return Result.ok(byId);
    }
    @PostMapping("save")
    public Result save(Product product) {

        boolean save = productService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(Product product) {

        boolean update = productService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {

        boolean byId = productService.removeById(id);
        return Result.ok();
    }


}
