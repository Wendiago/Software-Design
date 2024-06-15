package com.example.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovelByCatDTO {
    private String title;
    private String author;
    private String imageUrl;
    private List<String> status;
    private String newChapter;
}
