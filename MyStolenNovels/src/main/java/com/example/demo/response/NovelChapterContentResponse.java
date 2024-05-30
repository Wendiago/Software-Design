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
    public String title;

    @JsonProperty("chap_no")
    public int chapterNumber;

    @JsonProperty("chap_title")
    public String chapterTitle;

    public String content;
}
