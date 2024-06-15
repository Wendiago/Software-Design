package com.example.demo.response;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse<T> {
    private String status;
    private String message;
    private int status_code;
    private T data;
}
