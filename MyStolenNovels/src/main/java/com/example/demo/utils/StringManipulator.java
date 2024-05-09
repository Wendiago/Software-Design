package com.example.demo.utils;

import java.text.Normalizer;

public class StringManipulator {
    public String modify(String source){
        String normalizedStr = Normalizer.normalize(source, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return normalizedStr.replaceAll("\\s+", "-");
    }

    public int extractPageNumber(String url) {
        // Extract the page number from the URL
        String pageNumberString = url.substring(url.lastIndexOf("-") + 1, url.lastIndexOf("/"));
        return Integer.parseInt(pageNumberString);
    }
}
