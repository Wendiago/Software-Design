package com.example.demo.controller;

import model.Greeting;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/v1")
public class CustomerGreetingController {
    private final AtomicLong counter = new AtomicLong();
    private static final String greetingTemplate = "Hello, %s %s"; //hello gender and name
    @GetMapping("/greeting")
    public Greeting greeting(@RequestParam(value = "gender", defaultValue = "0") boolean gender,
                             @RequestParam(value = "customerName", defaultValue = "Customer") String customerName){
        return Greeting.builder()
                .id(counter.incrementAndGet())
                .content(String.format(greetingTemplate, gender ? "Mr." : "Ms.", customerName))
                .build();
    }
}
