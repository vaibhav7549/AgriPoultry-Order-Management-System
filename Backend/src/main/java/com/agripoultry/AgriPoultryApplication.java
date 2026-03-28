package com.agripoultry;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class AgriPoultryApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgriPoultryApplication.class, args);
    }
}