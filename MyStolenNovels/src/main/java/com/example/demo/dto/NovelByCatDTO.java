package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovelByCatDTO {
    private String title;
    private String author;
    private String imageUrl;
}
