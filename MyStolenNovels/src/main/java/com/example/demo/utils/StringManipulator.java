package com.example.demo.utils;

import org.springframework.stereotype.Component;

import java.text.Normalizer;

@Component
public class StringManipulator {
    public String modify(String source){
        String normalizedStr = Normalizer.normalize(source, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalizedStr.replaceAll("\\s+", "-");
    }
}
