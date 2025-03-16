package com;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan(basePackages = "com.it.mapper")
public class ShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(com.ShopApplication.class, args);
    }

}
