package com.controller.wx;

import com.admin.Result;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.domain.User;
import com.domain.VendingMachine;
import com.service.UserService;
import com.service.VendingMachineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/VendingMachine")
@RestController
public class VendingMachineController {


    @Autowired
    private VendingMachineService productService;

    @GetMapping()
    public Result list() {
        QueryWrapper<VendingMachine> last = new QueryWrapper<VendingMachine>().last("limit 5");
        List<VendingMachine> list = productService.list(last);
        return Result.ok(list);
    }




    @PostMapping("save")
    public Result save(@RequestBody VendingMachine product) {

        boolean save = productService.save(product);
        return Result.ok();
    }

    @PostMapping("updateById")
    public Result updateById(@RequestBody VendingMachine product) {

        boolean update = productService.updateById(product);
        return Result.ok();
    }

    @PostMapping("deleteById/{id}")
    public Result updateById(@PathVariable("id") Integer id) {

        boolean byId = productService.removeById(id);
        return Result.ok();
    }


}
