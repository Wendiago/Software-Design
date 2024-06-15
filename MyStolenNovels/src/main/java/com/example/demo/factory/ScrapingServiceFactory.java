package com.example.demo.factory;
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
    private static final Logger log = LoggerFactory.getLogger(ScrapingServiceFactory.class);

    @Autowired
    public ScrapingServiceFactory(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @PostConstruct
    public void init() throws Exception {
        try {
            Map<String, IScrapingServiceStrategy> beans = applicationContext.getBeansOfType(IScrapingServiceStrategy.class);
            for (Map.Entry<String, IScrapingServiceStrategy> bean : beans.entrySet()) {
                String strategyName = bean.getKey();
                IScrapingServiceStrategy strategy = bean.getValue();
                registerScrapingStrategy(strategyName, strategy);
                log.info("Get scraping service strategy {}", strategyName);
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private static String getStrategyName(String className) {
        int endIndex = className.indexOf("_ScrapingService");
        return className.substring(0, endIndex);
    }

    public void registerScrapingStrategy(String strategyName, IScrapingServiceStrategy strategy) throws Exception {
        try {
            strategies.put(getStrategyName(strategyName), strategy);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public void unregisterScrapingStrategy(String strategyName) {
        strategies.remove(strategyName);
    }

    public List<String> getAvailableSources() {
        return new ArrayList<>(strategies.keySet());
    }

    public IScrapingServiceStrategy getScrapingStrategy(String format) throws Exception {
        IScrapingServiceStrategy strategy = strategies.get(format);
        if (strategy == null) {
            throw new IllegalArgumentException("Can't not get strategy " + format);
        }
        return strategy;
    }
}

