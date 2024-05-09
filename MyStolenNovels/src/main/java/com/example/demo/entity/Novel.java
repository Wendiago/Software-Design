package com.example.demo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Novel {
    private long id;
    private String title;
    private String image;
    private String status;
    private String author;
    private int total_chapters;
    private int total_likes;
    private String total_view;
    private String chapters_new;
    private String description;
}
