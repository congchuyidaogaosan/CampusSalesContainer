package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.OrderInfo;
import com.domain.Type;
import com.service.OrderInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RequestMapping("/api/orders")
@RestController
public class OrderInfoController {

    @Autowired
    private OrderInfoService orderInfoService;


    @GetMapping()
    public Result list() {
        QueryWrapper<OrderInfo> last = new QueryWrapper<OrderInfo>().last("");
        List<OrderInfo> list = orderInfoService.list(last);
        return Result.ok(list);
    }

    @GetMapping("zhifu/{orderid}")
    public Result zhifu(@PathVariable("orderid") Integer orderid) {
        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("orderid", orderid);
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setPayStatus("已支付");
        boolean update = orderInfoService.update(orderInfo, queryWrapper);
        return Result.ok();
    }


    @GetMapping("byUser/{userID}")
    public Result byUser(@PathVariable("userID") Integer userID) {

        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id",userID);
        List<OrderInfo> list = orderInfoService.list(queryWrapper);
        return Result.ok(list);
    }

    @PostMapping("save")
    public Result save(@RequestBody OrderInfo orderInfo) {
        boolean save = orderInfoService.save(orderInfo);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(@RequestBody OrderInfo orderInfo) {
        boolean update = orderInfoService.updateById(orderInfo);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {
        boolean byId = orderInfoService.removeById(id);
        return Result.ok();
    }

}
