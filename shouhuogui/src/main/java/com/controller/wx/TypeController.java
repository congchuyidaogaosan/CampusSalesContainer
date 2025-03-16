package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.Product;
import com.domain.Type;
import com.domain.VendingMachine;
import com.service.ProductService;
import com.service.TypeService;
import com.service.VendingMachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/Type")
@RestController
public class TypeController {

    @Autowired
    private TypeService typeService;

    @Autowired
    private ProductService productService;

    @GetMapping()
    public Result list() {
        QueryWrapper<Type> last = new QueryWrapper<Type>().last("");
        List<Type> list = typeService.list(last);
        return Result.ok(list);
    }

    @GetMapping("/{categoryId}/products")
    public Result TypeProducts(@PathVariable("categoryId")Integer categoryId){

        Type byId = typeService.getById(categoryId);

        List<Product> list = productService.list(new QueryWrapper<Product>().eq("product_category",byId.getType()));
        return Result.ok(list);
    }

    @PostMapping("save")
    public Result save(Type product) {
        boolean save = typeService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(Type product) {
        boolean update = typeService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {
        boolean byId = typeService.removeById(id);
        return Result.ok();
    }


}
