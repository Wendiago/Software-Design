package com.example.demo.response;

import com.example.demo.dto.NovelByCatDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class NovelByCatResponse {
    @JsonProperty("novels")
    private List<NovelByCatDTO> novels;

    @JsonProperty("total_pages")
    private int totalPages;
}
