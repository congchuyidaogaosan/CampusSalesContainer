package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.domain.OrderProduct;
import com.service.OrderProductService;
import com.mapper.OrderProductMapper;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class OrderProductServiceImpl extends ServiceImpl<OrderProductMapper, OrderProduct>
    implements OrderProductService{

}




