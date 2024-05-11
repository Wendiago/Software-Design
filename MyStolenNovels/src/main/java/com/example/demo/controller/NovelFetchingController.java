package com.example.demo.controller;
import com.example.demo.response.*;
import com.example.demo.response.GET.GetCategoriesResponse;
import com.example.demo.response.GET.GetNovelByCategoryResponse;
import com.example.demo.response.GET.GetNovelChapterListResponse;
import com.example.demo.response.GET.GetNovelDetailResponse;
import com.example.demo.service.ScrapingService;
import com.example.demo.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class NovelFetchingController {
    private final ScrapingService scrapingService;

    // Get all categories
    @GetMapping("/categories")
    public ResponseEntity<GetCategoriesResponse> getAllCategories() {
        try {
            CategoriesResponse categoryList = scrapingService.getCategories();
            return ResponseEntity.ok(GetCategoriesResponse.builder()
                    .status("Success")
                    .message(MessageKeys.GET_CATEGORIES_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(categoryList)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GetCategoriesResponse.builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get novels by category
    @GetMapping("/category/{category}")
    public ResponseEntity<GetNovelByCategoryResponse> getNovelsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page
    ) {
        try {
            NovelByCatResponse novelByCatResponse = scrapingService.getNovelsByCategory(category, page);
            return ResponseEntity.ok(
                    GetNovelByCategoryResponse.builder()
                            .status("Success")
                            .message(MessageKeys.GET_NOVELSBYCAT_SUCCESSFULLY)
                            .status_code(HttpStatus.OK.value())
                            .data(novelByCatResponse)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GetNovelByCategoryResponse.builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get novel detail
    @GetMapping("/{title}")
    public ResponseEntity<GetNovelDetailResponse> getNovelDetail(
            @PathVariable String title
    ) {
        try {
            NovelDetailResponse response = scrapingService.getNovelDetail(title);
            return ResponseEntity.ok(GetNovelDetailResponse.builder()
                    .status("Success")
                    .message(MessageKeys.GET_NOVELDETAIL_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(response)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GetNovelDetailResponse.builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get chapter list of a novel
    @GetMapping("/{title}/chapter-list")
    public ResponseEntity<GetNovelChapterListResponse> getNovelChapterList(
            @PathVariable String title,
            @RequestParam(defaultValue = "1") int page
    ) {
        try {
            NovelChapterListResponse chapterList = scrapingService.getNovelChapterList(title, page);
            return ResponseEntity.ok(GetNovelChapterListResponse.builder()
                    .status("Success")
                    .message(MessageKeys.GET_CHAPTERLIST_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(chapterList)
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    GetNovelChapterListResponse.builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}