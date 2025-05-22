package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.DTO.CartDTO;
import com.domain.OrderInfo;
import com.domain.OrderProduct;
import com.domain.Product;
import com.service.OrderInfoService;
import com.service.OrderProductService;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.xml.crypto.Data;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RequestMapping("api/cart/")
@RestController
public class CartController {


    @Autowired
    private OrderProductService orderProductService;

    @Autowired
    private OrderInfoService orderInfoService;

    @Autowired
    private ProductService productService;

    private HashMap<Integer, List<CartDTO>> hashMap = new HashMap<>();

    @PostMapping("add")
    public Result add(@RequestBody CartDTO cartDTO) {

        if (hashMap.containsKey(cartDTO.getUserId())) {
            List<CartDTO> orderProducts = hashMap.get(cartDTO.getUserId());
            orderProducts.add(cartDTO);
        } else {
            ArrayList<CartDTO> cartDTOS = new ArrayList<>();
            cartDTOS.add(cartDTO);
            hashMap.put(cartDTO.getUserId(), cartDTOS);
        }
        return Result.ok(hashMap);

    }


    @PostMapping("/order/{uid}")
    public Result userBy(@PathVariable("uid")Integer uid){

        OrderInfo orderInfo= new OrderInfo();
        orderInfo.setUserId(uid);
        orderInfo.setOrderTime(new Date());
        orderInfo.setMachineId(1);

        orderInfo.setPayStatus("未支付");
        orderInfo.setOrderStatus("未支付");

        BigDecimal amount=new BigDecimal("0.0");

        if (hashMap.containsKey(uid)) {
            List<CartDTO> cartDTOS = hashMap.get(uid);
            for (CartDTO cartDTO:cartDTOS){
                amount=amount.add(cartDTO.getProduct().getProductPrice().multiply(new BigDecimal(cartDTO.getNum())));

            }

        }
        orderInfo.setOrderAmount(amount);
        orderInfo.setOrderNumber(System.currentTimeMillis()+"");

        boolean save = orderInfoService.save(orderInfo);

        if (hashMap.containsKey(uid)) {
            List<CartDTO> cartDTOS = hashMap.get(uid);
            for (CartDTO cartDTO:cartDTOS){
                amount=amount.add(cartDTO.getProduct().getProductPrice().multiply(new BigDecimal(cartDTO.getNum())));
                OrderProduct orderProduct = new OrderProduct();
                orderProduct.setProductId(cartDTO.getProductId());
                orderProduct.setOrderId(orderInfo.getOrderId());
                orderProduct.setProductQuantity(cartDTO.getNum());
                orderProductService.save(orderProduct);
            }

        }

        return Result.ok(orderInfo);
    }




    @GetMapping("byId/{id}")
    public Result byId(@PathVariable("id") Integer id) {

        List<CartDTO> cartDTOS = hashMap.get(id);
        if (cartDTOS == null) {
            return Result.ok(null);
        }

        for (CartDTO cartDTO : cartDTOS) {
            Product byId = productService.getById(cartDTO.getProductId());
            cartDTO.setProduct(byId);
        }
        return Result.ok(cartDTOS);
    }

    @PostMapping("del/{id}/{uid}")
    public Result del(@PathVariable("id") Integer id,@PathVariable("uid") Integer uid) {

        if (hashMap.containsKey(uid)) {
            List<CartDTO> orderProducts = hashMap.get(uid);
           int a=0;
            for (CartDTO cartDTO:orderProducts){
                if (cartDTO.getProductId().equals(id)){
                    orderProducts.remove(a);
                    break;
                }else {
                    a++;
                }
            }

        }

        return Result.ok(hashMap.get(uid));
    }

}
