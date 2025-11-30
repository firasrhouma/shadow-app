package com.programming.techie.productservice.repository;

import com.programming.techie.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Long> {

}
