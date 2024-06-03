package com.example.demo.service.ScrapingServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.response.*;

public interface IScrapingServiceStrategy {
    public NovelByCatResponse getNovelsByCategory(String category, int page) throws Exception;
    public NovelDetailResponse getNovelDetail(String title) throws Exception;
    public NovelChapterListResponse getNovelChapterList(String category, int page) throws Exception;
    public NovelChapterContentResponse getNovelChapterContent(String title, String chapterNumber) throws Exception;
    public CategoriesResponse getCategories() throws Exception;
    public SearchResponse getSearchResult(String keyword, int page) throws Exception;
    public NovelDownloadContentDTO getDownloadContent(String title) throws Exception;
}
