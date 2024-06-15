package com.example.demo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NovelDownloadContentResponse{
    private String status;
    private String message;
    private int status_code;
    private byte[] file;

    @JsonProperty("file_name")
    private String fileName;
}
