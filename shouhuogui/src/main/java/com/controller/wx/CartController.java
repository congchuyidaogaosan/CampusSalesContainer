package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.OrderProduct;
import com.service.OrderProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/cart")
@RestController()
public class CartController {


    @Autowired
    private OrderProductService orderProductService;


    @GetMapping("byUser/{id}")
    public Result byUser(@PathVariable("id") Integer id) {

        QueryWrapper<OrderProduct> queryWrapper = new QueryWrapper<>();

        QueryWrapper<OrderProduct> eq = queryWrapper.eq("",);

        orderProductService.list()


    }
}
