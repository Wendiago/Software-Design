package com.example.demo.factory;

import com.example.demo.service.ExportServices.IExportServiceStrategy;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ExportServiceFactory {
    private final Map<String, IExportServiceStrategy> strategies = new ConcurrentHashMap<>();
    private final ApplicationContext applicationContext;
    private static final Logger log = LoggerFactory.getLogger(ExportServiceFactory.class);
    @Autowired
    public ExportServiceFactory(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @PostConstruct
    private void init() throws Exception{
        try{
            Map<String, IExportServiceStrategy> beans = applicationContext.getBeansOfType(IExportServiceStrategy.class);
            for (Map.Entry<String, IExportServiceStrategy> bean : beans.entrySet()){
                String strategyName = bean.getKey();
                IExportServiceStrategy strategy = bean.getValue();
                registerExportStrategy(strategyName, strategy);
                log.info("Get export service strategy {}", strategyName);
            }
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }
    private static String getStrategyName(String className){
        int endIndex = className.indexOf("_ExportService");
        return className.substring(0, endIndex);
    }

    public void registerExportStrategy(String strategyName, IExportServiceStrategy strategy) throws Exception{
        try {
            strategies.put(strategyName, strategy);
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public void unregisterExportStrategy(String strategyName) throws Exception{
        try{
            strategies.remove(strategyName);
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    public List<String> getAvailableFormat() {
        return strategies.keySet().stream().toList();
    }

    public IExportServiceStrategy getExportStrategy(String format) throws Exception{
        IExportServiceStrategy strategy = strategies.get(format);
        if (strategy == null){
            throw new IllegalArgumentException("Can't not get strategy " + format);
        }
        return strategy;
    }
}
