package com.programming.techie.productservice.dto;

import java.math.BigDecimal;

public record ProductRequest(Long id, String name, String description, BigDecimal price , String category) {

}
