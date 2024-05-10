package com.example.demo.response.GET;

import com.example.demo.response.BaseResponse;
import com.example.demo.response.NovelByCatResponse;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class GetNovelByCategoryResponse extends BaseResponse{
    private NovelByCatResponse data;
}
