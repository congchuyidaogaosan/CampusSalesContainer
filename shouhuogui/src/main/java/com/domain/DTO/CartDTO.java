package com.domain.DTO;

import com.baomidou.mybatisplus.annotation.TableField;
import com.domain.Product;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class CartDTO   implements Serializable {

    @JsonProperty("ProductId")
    private Integer productId;
    @JsonProperty("Num")
    private Integer num;
    @JsonProperty("UserId")
    private Integer userId;

    private Product product;

    private Boolean selected=false;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

}
