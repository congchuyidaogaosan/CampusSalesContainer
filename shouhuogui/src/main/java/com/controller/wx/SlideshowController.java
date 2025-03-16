package com.controller.wx;

import com.admin.Result;
import com.domain.Slideshow;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/api/Slideshow")
@RestController
public class SlideshowController {


    @GetMapping("")
    public Result list() {

        List<Slideshow> slideshows = new ArrayList<>();

        slideshows.add(new Slideshow(1, "https://tse4-mm.cn.bing.net/th/id/OIP-C.VxQg3jvXD6jtkjrDVjzpbAHaCt?w=291&h=127&c=7&r=0&o=5&pid=1.7"));
        slideshows.add(new Slideshow(2, "https://tse4-mm.cn.bing.net/th/id/OIP-C.VxQg3jvXD6jtkjrDVjzpbAHaCt?w=291&h=127&c=7&r=0&o=5&pid=1.7"));

        return Result.ok(slideshows);
    }
}
