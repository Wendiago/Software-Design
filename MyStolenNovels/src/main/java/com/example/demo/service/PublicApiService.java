package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PublicApiService {
    @Autowired
    private RestTemplate restTemplate;

    public String fetchPublicApi(String apiUrl) {
        return restTemplate.getForObject(apiUrl, String.class);
    }
}
