package com.example.demo.factory;

import com.example.demo.controller.SourceController;
import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ScrapingServiceFactory {
    private final Map<String, IScrapingServiceStrategy> strategies = new ConcurrentHashMap<>();
    private final ApplicationContext applicationContext;
    private static final Logger log = LoggerFactory.getLogger(SourceController.class);

    @Autowired
    public ScrapingServiceFactory(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @PostConstruct
    public void init() throws Exception {
        try{
            Map<String, IScrapingServiceStrategy> beans = applicationContext.getBeansOfType(IScrapingServiceStrategy.class);
            for (Map.Entry<String, IScrapingServiceStrategy> entry : beans.entrySet()) {
                String beanName = entry.getKey();
                IScrapingServiceStrategy strategy = entry.getValue();
                registerScrapingStrategy(beanName, strategy);
                log.info("Get strategy {}", strategy);
            }
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    private static String getStrategyName(String className) {

        int endIndex = className.indexOf("_ScrapingService");
        if (endIndex != -1) {
            return className.substring(0, endIndex);
        } else {
            log.error("Error getting strategy {} name", className);
            return null;
        }
    }

    public void registerScrapingStrategy(String source, IScrapingServiceStrategy strategy) throws Exception {
        try{
            strategies.put(getStrategyName(source), strategy);
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public void unregisterScrapingStrategy(String source) {
        strategies.remove(source);
    }

    public List<String> getAvailableSources() {
        return new ArrayList<>(strategies.keySet());
    }

    public IScrapingServiceStrategy getScrapingStrategy(String source) {
        IScrapingServiceStrategy strategy = strategies.get(source);
        if (strategy == null) {
            throw new IllegalArgumentException("Invalid source: " + source);
        }
        return strategy;
    }
}
