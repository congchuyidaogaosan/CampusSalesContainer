package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.Product;
import com.domain.query.FatherQuery;
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
    public Result list(FatherQuery fatherQuery) {
        QueryWrapper<Product> queryWrapper = new QueryWrapper<>();
        if (fatherQuery.getCategoryId()!=null && !fatherQuery.getCategoryId().equals("")){
            queryWrapper.eq("product_category",fatherQuery.getCategoryId());
        }

        if (fatherQuery.getKeyword()!=null && !fatherQuery.getKeyword().equals("")){
            queryWrapper.like("product_name",fatherQuery.getKeyword());
        }

        List<Product> list = productService.list(queryWrapper);
        return Result.ok(list);
    }

    @GetMapping("{id}")
    public Result find(@PathVariable("id")Integer id) {

        Product byId = productService.getById(id);
        return Result.ok(byId);
    }
    @PostMapping("save")
    public Result save(@RequestBody Product product) {

        boolean save = productService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(@RequestBody Product product) {

        boolean update = productService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {

        boolean byId = productService.removeById(id);
        return Result.ok();
    }


}
