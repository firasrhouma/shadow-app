package com.programming.techie.orderservice.controller;

import com.programming.techie.orderservice.dto.OrderRequest;
import com.programming.techie.orderservice.model.Order;
import com.programming.techie.orderservice.service.EmailService;
import com.programming.techie.orderservice.service.OrderService;
import com.programming.techie.orderservice.service.SMSservice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final EmailService emailService;
    private final SMSservice smsService;
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public String placeOrder(@RequestBody OrderRequest orderRequest) {
        Order savedOrder =  orderService.placeOrder(orderRequest);
        String subject = "Nouvelle commande!";
        String text = "Nom du client " + savedOrder.getClientName() + "\n"+
                 "Products: " + savedOrder.getProductName()  + "\n"+
                "Total: " + savedOrder.getPrice() + "\n"  + "\n" +
                "Numero du client " + savedOrder.getPhoneNumber() + "\n"+
                "Adresse: " + savedOrder.getAddress()+ "\n"+
                 "Quantite :" + savedOrder.getQuantity();

        emailService.sendOrderNotification("lainecomfortdeco@gmail.com", subject, text);
        String sms = String.format(
                " Commande details:\n\n" +
                        "Nom du client: %s\n" +
                        "Téléphone: %s\n" +
                        "Address: %s\n\n" +
                        "Produit: %s\n" +
                        "Quantité: %d\n" +
                        "Prix total: %.2f\n",
                savedOrder.getClientName(),
                savedOrder.getPhoneNumber(),
                savedOrder.getAddress(),
                savedOrder.getProductName(),
                savedOrder.getQuantity(),
                savedOrder.getPrice()
        );
       smsService.sendSms("+21698383991",sms);

        return "Order Placed";
    }
}
