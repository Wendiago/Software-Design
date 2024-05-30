package com.example.demo.service;

import com.example.demo.response.*;

public interface IScrapingServiceStrategy {
    public NovelByCatResponse getNovelsByCategory(String category, int page) throws Exception;
    public NovelDetailResponse getNovelDetail(String title) throws Exception;
    public NovelChapterListResponse getNovelChapterList(String category, int page) throws Exception;
    public NovelChapterContentResponse getNovelChapterContent(String title, int chapterNumber) throws Exception;
    public CategoriesResponse getCategories() throws Exception;
    public SearchResponse getSearchResult(String keyword, int page) throws Exception;
}
