package com.example.demo.response.GET;

import com.example.demo.response.BaseResponse;
import com.example.demo.response.NovelDetailResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GetNovelDetailResponse extends BaseResponse {
    private NovelDetailResponse data;
}
