package com.example.demo.controller;

import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.response.*;
import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
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
    public ResponseEntity<?> getAllCategories(
            @RequestBody List<String> sources
    ) {
        CategoriesResponse categoryRes = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy scrapingService = scrapingFactory.getScrapingStrategy(source);
                categoryRes = scrapingService.getCategories();
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Error fetching categories from source {}: {}", source, e.getMessage());
            }
        }

        if (categoryRes != null) {
            return ResponseEntity.ok(BaseResponse.<CategoriesResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_CATEGORIES_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(categoryRes)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<CategoriesResponse>builder()
                            .status("Failed")
                            .message("Unable to fetch categories from any source")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get novels by category
    @PostMapping("/category/{category}")
    public ResponseEntity<?> getNovelsByCategory(
            @RequestBody List<String> sources,
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page
    ) {
        NovelByCatResponse novelByCatResponse = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                novelByCatResponse = strategy.getNovelsByCategory(category, page);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Error fetching novels by category from source {}: {}", source, e.getMessage());
            }
        }

        if (novelByCatResponse != null) {
            return ResponseEntity.ok(BaseResponse.<NovelByCatResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_NOVELSBYCAT_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(novelByCatResponse)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<NovelByCatResponse>builder()
                            .status("Failed")
                            .message("Failed to get novels by category from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get novel detail
    @PostMapping("/{title}")
    public ResponseEntity<?> getNovelDetail(
            @RequestBody List<String> sources,
            @PathVariable String title
    ) {
        NovelDetailResponse response = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                response = strategy.getNovelDetail(title);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Error fetching novel detail from {}, {}", source, e.getMessage());
            }
        }

        if (response != null) {
            return ResponseEntity.ok(BaseResponse.<NovelDetailResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_NOVELDETAIL_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(response)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<NovelDetailResponse>builder()
                            .status("Failed")
                            .message("Failed to get novel detail from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get chapter list of a novel
    @PostMapping("/{title}/chapter-list")
    public ResponseEntity<?> getNovelChapterList(
            @RequestBody List<String> sources,
            @PathVariable String title,
            @RequestParam(defaultValue = "1") int page
    ) {
        NovelChapterListResponse chapterList = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                chapterList = strategy.getNovelChapterList(title, page);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Failed to get chapter list of a novel from {}, {}", source, e.getMessage());
            }
        }

        if (chapterList != null) {
            return ResponseEntity.ok(BaseResponse.<NovelChapterListResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_CHAPTERLIST_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(chapterList)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<NovelChapterListResponse>builder()
                            .status("Failed")
                            .message("Failed to get chapter list of novel from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get chapter content of a novel
    @PostMapping("/{title}/{chapter-number}")
    public ResponseEntity<?> getChapterContent(
            @RequestBody List<String> sources,
            @PathVariable String title,
            @PathVariable("chapter-number") String chapterNumber
    ) {
        NovelChapterContentResponse contentRes = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                contentRes = strategy.getNovelChapterContent(title, chapterNumber);
                //log.info(String.valueOf(contentRes));
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Failed to get chapter content of novel from {}, {}", source, e.getMessage());
            }
        }

        if (contentRes != null) {
            return ResponseEntity.ok(BaseResponse.<NovelChapterContentResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_CHAPTERCONTENT_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(contentRes)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<NovelChapterContentResponse>builder()
                            .status("Failed")
                            .message("Failed to get chapter content of novel from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    // Get search result
    @PostMapping("/search")
    public ResponseEntity<?> getSearchResult(
            @RequestBody List<String> sources,
            @RequestParam("keyword") String keyword,
            @RequestParam(defaultValue = "1") int page
    ) {
        SearchResponse contentRes = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                contentRes = strategy.getSearchResult(keyword, page);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Failed to get search result from {}, {}", source, e.getMessage());
            }
        }

        if (contentRes != null) {
            return ResponseEntity.ok(BaseResponse.<SearchResponse>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_SEARCHRESULT_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(contentRes)
                    .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    BaseResponse.<SearchResponse>builder()
                            .status("Failed")
                            .message("Failed to get search result from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @PostMapping("/{title}/downloadContent")
    public ResponseEntity<?> getNovelDownloadContent(
            @RequestBody List<String> sources,
            @PathVariable String title
    ) {
        NovelDownloadContentDTO response = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy strategy = scrapingFactory.getScrapingStrategy(source);
                response = strategy.getDownloadContent(title);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Error fetching novel download content from {}, {}", source, e.getMessage());
            }
        }

        if (response != null) {
            return ResponseEntity.ok(BaseResponse.<NovelDownloadContentDTO>builder()
                    .status("Success getting from source " + succeededSource)
                    .message(MessageKeys.GET_NOVELDETAIL_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(response)
                    .build()
            );
        } else {
            return ResponseEntity.internalServerError().body(
                    BaseResponse.<NovelDownloadContentDTO>builder()
                            .status("Failed")
                            .message("Failed to get novel download content from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}