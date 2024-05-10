package com.example.demo.controller;
import com.example.demo.response.BaseResponse;
import com.example.demo.response.GET.GetNovelByCategoryResponse;
import com.example.demo.response.NovelByCatResponse;
import com.example.demo.service.ScrapingService;
import com.example.demo.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("${api.prefix}/")
@RequiredArgsConstructor
public class NovelFetchingController {
    private final ScrapingService scrapingService;

    @GetMapping("/the-loai")
    public ResponseEntity<?> getNovelsByCategory(
            @RequestParam String category,
            @RequestParam(defaultValue = "1") int page
    ) throws Exception {
        try{
            NovelByCatResponse novelByCatResponse = scrapingService.getNovelsByCategory(category, page);
            return ResponseEntity.ok(
                    GetNovelByCategoryResponse.builder()
                            .status("Success")
                            .message(MessageKeys.GET_NOVELSBYCAT_SUCCESSFULLY)
                            .status_code(HttpStatus.OK.value())
                            .data(novelByCatResponse)
                            .build()
            );
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GetNovelByCategoryResponse.builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.NOT_FOUND.value())
                            .data(NovelByCatResponse.builder().novels(Collections.emptyList()).totalPages(0).build())
                            .build()
            );
        }
    }
}
