package com.example.demo.utils;

import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;

@Component
public class StringManipulator {
    public String modify(String source){
        String normalizedStr = Normalizer.normalize(source, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalizedStr.replaceAll("\\s+", "-");
    }

    public String urlEncode(String source){
        if (source == null || source.isEmpty()){
            return source;
        }
        return URLEncoder.encode(source, StandardCharsets.UTF_8);
    }
}
