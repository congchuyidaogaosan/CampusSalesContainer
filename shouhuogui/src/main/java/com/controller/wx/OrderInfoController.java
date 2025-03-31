package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.OrderInfo;
import com.domain.OrderProduct;
import com.domain.Product;
import com.domain.Type;
import com.service.OrderInfoService;
import com.service.OrderProductService;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RequestMapping("/api/orders")
@RestController
public class OrderInfoController {

    @Autowired
    private OrderInfoService orderInfoService;

    @Autowired
    private OrderProductService orderProductService;

    @Autowired
    private ProductService productService;

    @GetMapping()
    public Result list() {
        QueryWrapper<OrderInfo> last = new QueryWrapper<OrderInfo>().last("");
        List<OrderInfo> list = orderInfoService.list(last);
        return Result.ok(list);
    }

    @GetMapping("zhifu/{orderid}/{mai}")
    public Result zhifu(@PathVariable("orderid") Integer orderid,@PathVariable("mai") Integer mai) {
        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderid);
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setPayStatus("已支付");
        orderInfo.setMachineId(mai);
        boolean update = orderInfoService.update(orderInfo, queryWrapper);
        return Result.ok();
    }

    @GetMapping("{orderid}")
    public Result orderDetail(@PathVariable("orderid")Integer orderid){

        QueryWrapper<OrderProduct> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id",orderid);

        List<OrderProduct> list = orderProductService.list(queryWrapper);

        for (OrderProduct orderProduct:list){
            Product byId = productService.getById(orderProduct.getId());
            orderProduct.setProduct(byId);
        }

        return Result.ok(list);
    }

    //6/cancel

    @GetMapping("{orderid}/cancel")
    public Result cancel(@PathVariable("orderid")Integer orderid){

        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderid);
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setPayStatus("已取消");
        boolean update = orderInfoService.update(orderInfo, queryWrapper);
        return Result.ok();
    }


    @GetMapping("{orderid}/pickup")
    public Result pickup(@PathVariable("orderid")Integer orderid){

        QueryWrapper<OrderInfo> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("order_id", orderid);
        OrderInfo orderInfo = new OrderInfo();
        orderInfo.setPayStatus("已取货");
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

    @GetMapping("/find/{id}")
    public Result find(@PathVariable("id")Integer id){
        OrderInfo byId = orderInfoService.getById(id);
        return Result.ok(byId);
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
