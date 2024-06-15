package com.example.demo.utils;

import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;

@Component
public class StringManipulator {
    public String modify(String source) {
        // Normalize the string and remove diacritical marks
        String normalizedStr = Normalizer.normalize(source, Normalizer.Form.NFD);

        // Replace Vietnamese-specific characters with their ASCII equivalents
        String replacedStr = normalizedStr.replaceAll("[đĐ]", "d")
                .replaceAll("[ăắằẳẵặĂẮẰẲẴẶ]", "a")
                .replaceAll("[âấầẩẫậÂẤẦẨẪẬ]", "a")
                .replaceAll("[êếềểễệÊẾỀỂỄỆ]", "e")
                .replaceAll("[ôốồổỗộÔỐỒỔỖỘ]", "o")
                .replaceAll("[ơớờởỡợƠỚỜỞỠỢ]", "o")
                .replaceAll("[ưứừửữựƯỨỪỬỮỰ]", "u")
                .replaceAll("[íìỉĩịÍÌỈĨỊ]", "i")
                .replaceAll("[ýỳỷỹỵÝỲỶỸỴ]", "y")
                .replaceAll("[óòỏõọÓÒỎÕỌ]", "o")
                .replaceAll("[éèẻẽẹÉÈẺẼẸ]", "e")
                .replaceAll("[úùủũụÚÙỦŨỤ]", "u");

        // Remove all diacritical marks that were not specifically handled
        replacedStr = replacedStr.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");

        // Replace spaces with hyphens
        return replacedStr.replaceAll("\\s+", "-").toLowerCase();
    }

    public String urlEncode(String source){
        if (source == null || source.isEmpty()){
            return source;
        }
        return URLEncoder.encode(source, StandardCharsets.UTF_8);
    }
}
