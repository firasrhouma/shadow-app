package com.programming.techie.orderservice.service;

import com.programming.techie.orderservice.dto.OrderRequest;
import com.programming.techie.orderservice.model.Order;
import com.programming.techie.orderservice.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service

@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrderRepository orderRepository;

    public Order placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setPrice(orderRequest.price());
        order.setQuantity(orderRequest.quantity());
        order.setProductName(orderRequest.productName());
        order.setPhoneNumber(orderRequest.phoneNumber());
        order.setAddress(orderRequest.address());
        order.setClientName(orderRequest.clientName());
        orderRepository.save(order);
        return order;
    }
}