package com.controller.wx;

import com.admin.Result;
import com.domain.Product;
import com.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RequestMapping("/api/hotProduct")
@RestController
public class hotProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Result hotProduct() {
        Random rand = new Random();

        List<Product> products = new ArrayList<>();

        List<Product> list = productService.list();
        if (list.size()<=4){
            return Result.ok(list);
        }


        for (int a = 0; a <= 4; a++) {
            int i = rand.nextInt(list.size() + 1);
            Product product = list.get(i);
            products.add(product);
        }

        return Result.ok(products);
    }

}
