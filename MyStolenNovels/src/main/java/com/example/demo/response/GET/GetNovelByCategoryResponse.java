package com.example.demo.response.GET;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.response.NovelByCatResponse;
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
public class GetNovelByCategoryResponse {
    @JsonProperty("message")
    private String message;

    private NovelByCatResponse data;
}
