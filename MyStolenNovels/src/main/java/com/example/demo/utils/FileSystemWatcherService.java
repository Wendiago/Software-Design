package com.example.demo.utils;

import com.example.demo.factory.ExportServiceFactory;
import com.example.demo.factory.ScrapingServiceFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;

@Service
public class FileSystemWatcherService implements ApplicationContextAware {

    private ApplicationContext applicationContext;
    private final ScrapingServiceFactory scrapingServiceFactory;
    private final ExportServiceFactory exportServiceFactory;

    public FileSystemWatcherService(ScrapingServiceFactory scrapingServiceFactory, ExportServiceFactory exportServiceFactory) {
        this.scrapingServiceFactory = scrapingServiceFactory;
        this.exportServiceFactory = exportServiceFactory;
    }

    @PostConstruct
    public void init() {
        startWatching();
    }

    private void startWatching() {
        try {
            WatchService watchService = FileSystems.getDefault().newWatchService();

            Paths.get("src/main/java/com/example/demo/service/ScrapingServices").register(watchService,
                    StandardWatchEventKinds.ENTRY_CREATE,
                    StandardWatchEventKinds.ENTRY_DELETE);

            Thread watcherThread = new Thread(() -> {
                try {
                    WatchKey key;
                    while ((key = watchService.take()) != null) {
                        for (WatchEvent<?> event : key.pollEvents()) {
                            if (event.kind() == StandardWatchEventKinds.ENTRY_CREATE ||
                                    event.kind() == StandardWatchEventKinds.ENTRY_DELETE) {
                                // Trigger context refresh
                                refreshApplicationContext();
                            }
                        }
                        key.reset();
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

            watcherThread.setDaemon(true);
            watcherThread.start();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void refreshApplicationContext() {
        // Reload strategies
        scrapingServiceFactory.init();
        //exportServiceFactory.initializeStrategies();
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }
}
