package com.example.demo.utils;

import com.example.demo.factory.ExportServiceFactory;
import com.example.demo.factory.ScrapingServiceFactory;
import com.example.demo.service.ExportServices.IExportServiceStrategy;
import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@AllArgsConstructor
public class DirectoryWatcher implements Runnable {
    private final Path path;
    private final DynamicClassLoader classLoader;
    private final ScrapingServiceFactory scrapingServiceFactory;
    private final ExportServiceFactory exportServiceFactory;
    private static final Logger log = LoggerFactory.getLogger(ExportServiceFactory.class);

    @Override
    public void run() {
        try {
            watch();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void watch() throws IOException, InterruptedException {
        log.info(String.valueOf(path));
        WatchService watchService = FileSystems.getDefault().newWatchService();
        path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE, StandardWatchEventKinds.ENTRY_DELETE);

        WatchKey key;
        while ((key = watchService.take()) != null) {
            for (WatchEvent<?> event : key.pollEvents()) {
                WatchEvent.Kind<?> kind = event.kind();
                File file = path.resolve((Path) event.context()).toFile();
                if (file.getName().endsWith(".class")) {
                    try {
                        if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                            Class<?> clazz = classLoader.loadClassFromFile(file);
                            if (IScrapingServiceStrategy.class.isAssignableFrom(clazz)) {
                                IScrapingServiceStrategy strategy = (IScrapingServiceStrategy) clazz.getDeclaredConstructor().newInstance();
                                scrapingServiceFactory.registerScrapingStrategy(clazz.getSimpleName(), strategy);
                            } else if (IExportServiceStrategy.class.isAssignableFrom(clazz)) {
                                IExportServiceStrategy strategy = (IExportServiceStrategy) clazz.getDeclaredConstructor().newInstance();
                                exportServiceFactory.registerExportStrategy(clazz.getSimpleName(), strategy);
                            }
                        } else if (kind == StandardWatchEventKinds.ENTRY_DELETE) {
                            String className = getClassName(file);
                            scrapingServiceFactory.unregisterScrapingStrategy(className);
                            exportServiceFactory.unregisterExportStrategy(className);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
            key.reset();
        }
    }

    private String getClassName(File file) {
        String path = file.getPath();
        String className = path.substring(path.indexOf("com"), path.length() - 6); // Remove .class
        return className.replace(File.separatorChar, '.');
    }
}
