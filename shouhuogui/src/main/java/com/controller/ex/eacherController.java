package com.controller.ex;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.OrderInfo;
import com.service.OrderInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("eacher")
@RestController
public class eacherController {


    @Autowired
    private OrderInfoService orderInfoService;


    @GetMapping("ordereacher")
    public Result ordereacher(){

        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("COUNT(order_number) as number,DATE_FORMAT(order_time, '%Y-%m')  as mother");
        queryWrapper.groupBy("DATE_FORMAT(order_time, '%Y-%m')");

        List<Map<String, Object>> maps = orderInfoService.listMaps(queryWrapper);
        return Result.ok(maps);
    }




    @GetMapping("orderpriceeacher")
    public Result orderpriceeacher(){

        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("SUM(order_amount) as number,DATE_FORMAT(order_time, '%Y-%m')  as mother");
        queryWrapper.groupBy("DATE_FORMAT(order_time, '%Y-%m')");

        List<Map<String, Object>> maps = orderInfoService.listMaps(queryWrapper);
        return Result.ok(maps);
    }
}
