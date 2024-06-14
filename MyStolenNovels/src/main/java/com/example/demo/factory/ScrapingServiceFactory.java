package com.example.demo.factory;

import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
import jakarta.annotation.PostConstruct;
import org.reflections.Reflections;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ScrapingServiceFactory {

    private final Map<String, IScrapingServiceStrategy> strategies = new ConcurrentHashMap<>();
    private final Reflections reflections;
    private static final Logger log = LoggerFactory.getLogger(ScrapingServiceFactory.class);

    @Autowired
    public ScrapingServiceFactory() {
        this.reflections = new Reflections("com.example.demo.service.ScrapingServices");
    }

    @PostConstruct
    public void init() {
        resetStrategies();
    }

    public void resetStrategies() {
        try {
            strategies.clear();
            Set<Class<? extends IScrapingServiceStrategy>> classes = reflections.getSubTypesOf(IScrapingServiceStrategy.class);
            for (Class<? extends IScrapingServiceStrategy> clazz : classes) {
                IScrapingServiceStrategy strategy = clazz.getDeclaredConstructor().newInstance(); // Instantiate using constructor
                log.info("Loaded strategy: {}", clazz.getSimpleName());
                registerScrapingStrategy(getStrategyName(clazz.getSimpleName()), strategy);
            }
        } catch (Exception e) {
            log.error("Error initializing scraping strategies", e);
        }
    }

    // Method to register a new scraping strategy dynamically
    public void registerScrapingStrategy(String source, IScrapingServiceStrategy strategy) {
        strategies.put(source, strategy);
    }

    private static String getStrategyName(String beanName) {
        int endIndex = beanName.indexOf("_ScrapingService");
        if (endIndex != -1) {
            return beanName.substring(0, endIndex).toLowerCase();
        } else {
            log.error("Error getting strategy name for bean: {}", beanName);
            return null;
        }
    }

    // Method to unregister a scraping strategy dynamically
    public void unregisterScrapingStrategy(String source) {
        strategies.remove(source);
    }

    // Method to get available sources
    public List<String> getAvailableSources() {
        return new ArrayList<>(strategies.keySet());
    }

    // Method to get a scraping strategy by source name
    public IScrapingServiceStrategy getScrapingStrategy(String source) {
        IScrapingServiceStrategy strategy = strategies.get(source);
        if (strategy == null) {
            throw new IllegalArgumentException("Invalid source: " + source);
        }
        return strategy;
    }
}

