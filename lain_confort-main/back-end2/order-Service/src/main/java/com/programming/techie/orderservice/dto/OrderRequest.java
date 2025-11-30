package com.programming.techie.orderservice.dto;

import java.math.BigDecimal;

public record OrderRequest( Long id, String orderNumber, BigDecimal price,
        Integer quantity ,
         String productName,
         Integer phoneNumber,
         String address, String clientName) {
}
