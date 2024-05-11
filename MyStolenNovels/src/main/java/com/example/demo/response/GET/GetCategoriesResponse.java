package com.example.demo.response.GET;

import com.example.demo.response.BaseResponse;
import com.example.demo.response.CategoriesResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetCategoriesResponse extends BaseResponse {
    private CategoriesResponse data;
}
