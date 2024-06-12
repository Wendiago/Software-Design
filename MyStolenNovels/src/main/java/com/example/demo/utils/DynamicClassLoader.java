package com.example.demo.utils;

import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;

@Component
public class DynamicClassLoader extends URLClassLoader {

    public DynamicClassLoader(URL[] urls) {
        super(urls);
    }

    public void addFile(File file) throws IOException {
        addURL(file.toURI().toURL());
    }

    public Class<?> loadClassFromFile(File file) throws ClassNotFoundException, IOException {
        addFile(file);
        String className = getClassName(file);
        return Class.forName(className, true, this);
    }

    private String getClassName(File file) throws IOException {
        // Convert file path to class name (e.g., com/example/demo/service/Truyenfull_ScrapingService.class -> com.example.demo.service.Truyenfull_ScrapingService)
        String path = file.getPath();
        String className = path.substring(path.indexOf("com"), path.length() - 6); // Remove .class
        return className.replace(File.separatorChar, '.');
    }
}
