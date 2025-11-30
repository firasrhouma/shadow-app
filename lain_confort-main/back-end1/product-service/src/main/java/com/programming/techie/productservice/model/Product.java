package com.programming.techie.productservice.model;

import jakarta.persistence.*;
import lombok.*;


import java.math.BigDecimal;
@Table(name = "product")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
@ToString
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
}