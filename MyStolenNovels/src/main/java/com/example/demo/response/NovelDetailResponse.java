package com.example.demo.response;

import com.example.demo.dto.NovelDetailDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovelDetailResponse {
    private String title;
    private String image;
    private String author;
    private String genres;
    private String source;
    private String rating;
    private String description;
}
