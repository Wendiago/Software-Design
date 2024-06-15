package com.example.demo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NovelChapterContentResponse {
    private String title;

    @JsonProperty("chap_no")
    private String chapterNumber;

    @JsonProperty("chap_title")
    private String chapterTitle;

    private String content;

    @JsonProperty("text_content")
    private String textContent;
}
