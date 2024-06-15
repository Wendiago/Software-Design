package com.example.demo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovelChapterListResponse {
    @JsonProperty("title")
    private String novelTitle;

    @JsonProperty("chapters")
    private List<String> chapterList;

    @JsonProperty("chapter_number_list")
    private List<String> chapterNumberList;

    @JsonProperty("raw_chapter_number_list")
    private List<String> rawChapterNumberList;

    @JsonProperty("total_pages")
    private int totalPages;

    @JsonProperty("current_page")
    private int currentPage;
}
