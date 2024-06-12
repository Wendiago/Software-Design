package com.example.demo.utils;

import com.example.demo.factory.ExportServiceFactory;
import com.example.demo.factory.ScrapingServiceFactory;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class Initializer {
    @Value("${dynamic.loader.service-dir}")
    private String serviceDir;
    private final DynamicClassLoader classLoader;
    private final ScrapingServiceFactory scrapingServiceFactory;
    private final ExportServiceFactory exportServiceFactory;
    private static final Logger log = LoggerFactory.getLogger(ExportServiceFactory.class);

    public Initializer(DynamicClassLoader classLoader, ScrapingServiceFactory scrapingServiceFactory, ExportServiceFactory exportServiceFactory) {
        this.classLoader = classLoader;
        this.scrapingServiceFactory = scrapingServiceFactory;
        this.exportServiceFactory = exportServiceFactory;
    }

    @PostConstruct
    public void init() {
        startWatching();
    }

    private void startWatching() {
        log.info(serviceDir);
        Path path = Paths.get(serviceDir);
        log.info(String.valueOf(path));
        DirectoryWatcher directoryWatcher = new DirectoryWatcher(path, classLoader, scrapingServiceFactory, exportServiceFactory);
        Thread watcherThread = new Thread(directoryWatcher);
        watcherThread.start();
    }
}