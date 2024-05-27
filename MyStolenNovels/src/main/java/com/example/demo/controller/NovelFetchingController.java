package com.example.demo.controller;

import com.example.demo.factory.ScrapingServiceFactory;
import com.example.demo.response.*;
import com.example.demo.response.GET.*;
import com.example.demo.service.IScrapingServiceStrategy;
import com.example.demo.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class NovelFetchingController {
    private final ScrapingServiceFactory scrapingFactory;
    private static final Logger log = LoggerFactory.getLogger(NovelFetchingController.class);

    // Get all categories
    @PostMapping("/categories")
    public ResponseEntity<GetCategoriesResponse> getAllCategories(
            @RequestBody List<String> sources
    ) {
        for (String source : sources) {
            try {
                IScrapingServiceStrategy scrapingService = scrapingFactory.getScrapingStrategy(source);
                CategoriesResponse categoryList = scrapingService.getCategories();
                return ResponseEntity.ok(GetCategoriesResponse.builder()
                        .status("Success")
                        .message(MessageKeys.GET_CATEGORIES_SUCCESSFULLY)
                        .status_code(HttpStatus.OK.value())
                        .data(categoryList)
                        .build()
                );
            } catch (Exception e) {
                // Log error and try the next source
                log.error("Error fetching categories from source {}: {}", source, e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body(
                GetCategoriesResponse.builder()
                        .status("Failed")
                        .message("Unable to fetch categories from all source")
                        .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }

    // Get novels by category
    @PostMapping("/category/{category}")
    public ResponseEntity<GetNovelByCategoryResponse> getNovelsByCategory(
            @RequestBody List<String> sources,
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page
    ) {
        for (String source : sources){
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                NovelByCatResponse novelByCatResponse = strategy.getNovelsByCategory(category, page);
                return ResponseEntity.ok(
                        GetNovelByCategoryResponse.builder()
                                .status("Success")
                                .message(MessageKeys.GET_NOVELSBYCAT_SUCCESSFULLY)
                                .status_code(HttpStatus.OK.value())
                                .data(novelByCatResponse)
                                .build()
                );
            } catch (Exception e) {
                log.error("Error fetching novels by category from source {}: {}", source, e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body(
                GetNovelByCategoryResponse.builder()
                        .status("Failed")
                        .message("Failed to get novels by category from all sources")
                        .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }

    // Get novel detail
    @PostMapping("/{title}")
    public ResponseEntity<GetNovelDetailResponse> getNovelDetail(
            @RequestBody List<String> sources,
            @PathVariable String title
    ) {
        for (String source : sources){
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                NovelDetailResponse response = strategy.getNovelDetail(title);
                return ResponseEntity.ok(GetNovelDetailResponse.builder()
                        .status("Success")
                        .message(MessageKeys.GET_NOVELDETAIL_SUCCESSFULLY)
                        .status_code(HttpStatus.OK.value())
                        .data(response)
                        .build()
                );
            } catch (Exception e) {
                log.error("Error fetching novel detail from {}, {}", source, e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body(
                GetNovelDetailResponse.builder()
                        .status("Failed")
                        .message("Failed to get novel detail from a novel")
                        .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }

    // Get chapter list of a novel
    @PostMapping("/{title}/chapter-list")
    public ResponseEntity<GetNovelChapterListResponse> getNovelChapterList(
            @RequestBody List<String> sources,
            @PathVariable String title,
            @RequestParam(defaultValue = "1") int page
    ) {
        for (String source : sources){
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                NovelChapterListResponse chapterList = strategy.getNovelChapterList(title, page);
                return ResponseEntity.ok(GetNovelChapterListResponse.builder()
                        .status("Success")
                        .message(MessageKeys.GET_CHAPTERLIST_SUCCESSFULLY)
                        .status_code(HttpStatus.OK.value())
                        .data(chapterList)
                        .build()
                );
            } catch (Exception e) {
                log.error("Failed to get chapter list of a novel from {}, {}", source, e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body(
                GetNovelChapterListResponse.builder()
                        .status("Failed")
                        .message("Failed to get chapter list of novel from all sources")
                        .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }

    //Get chapter content of a novel
    @PostMapping("/{title}/{chapter-number}")
    public ResponseEntity<?> getChapterContent(
            @RequestBody List<String> sources,
            @PathVariable String title,
            @PathVariable("chapter-number") int chapterNumber
    ){
        for (String source : sources){
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                NovelChapterContentResponse contentRes = strategy.getNovelChapterContent(title, chapterNumber);
                return ResponseEntity.ok(GetNovelChapterContentResponse.builder()
                        .status("Success")
                        .message(MessageKeys.GET_CHAPTERCONTENT_SUCCESSFULLY)
                        .status_code(HttpStatus.OK.value())
                        .data(contentRes)
                        .build()
                );
            } catch (Exception e) {
                log.error("Failed to get chapter content of novel from {}, {}", source, e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body(
                GetNovelChapterContentResponse.builder()
                        .status("Failed")
                        .message("Failed to get chapter content of novel from all sources")
                        .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .build()
        );
    }
}