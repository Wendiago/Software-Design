package com.example.demo.response.GET;

import com.example.demo.response.BaseResponse;
import com.example.demo.response.NovelChapterContentResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class GetNovelChapterContentResponse extends BaseResponse {
    private NovelChapterContentResponse data;
}
