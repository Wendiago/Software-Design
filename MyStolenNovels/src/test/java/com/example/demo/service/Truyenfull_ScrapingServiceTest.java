package com.example.demo.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.response.CategoriesResponse;
import com.example.demo.response.NovelByCatResponse;
import com.example.demo.response.NovelChapterContentResponse;
import com.example.demo.response.NovelChapterListResponse;
import com.example.demo.response.NovelDetailResponse;
import com.example.demo.response.SearchResponse;
import com.example.demo.service.ScrapingServices.Truyenfull_ScrapingService;
import com.example.demo.utils.StringManipulator;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class Truyenfull_ScrapingServiceTest {
    private static Truyenfull_ScrapingService scrapingService;
    @BeforeAll
    public static void setUpClass() {
        scrapingService = new Truyenfull_ScrapingService();
    }
    @Mock
    private StringManipulator stringManipulator;

    @Test
    public void testGetTotalPages() throws Exception {
        String url = "https://truyenfull.vn/the-loai/kiem-hiep";
        Document document = Jsoup.connect(url).get();
        // Use reflection to access the private static method
        Method method = Truyenfull_ScrapingService.class.getDeclaredMethod("getTotalPages", Document.class);
        method.setAccessible(true);

        // Act
        int totalPages = (int) method.invoke(null, document);

        // Assert
        assertNotNull(totalPages);
        // Replace the expected value based on the test HTML
        assertEquals(37, totalPages);
    }
    @Test
    public void testExtractNovelsFromPage() throws Exception {
        String url = "https://truyenfull.vn/the-loai/doan-van/trang-40/";
        Document document = Jsoup.connect(url).get();
        List<NovelByCatDTO> expectation = new ArrayList<>();
        NovelByCatDTO novelByCat = NovelByCatDTO.builder()
                    .title("[Đoản Văn] Phù Dung Hoa, Sớm Nở, Tối Tàn")
                    .author("Vô Tâm Tà Thiếu")
                    .imageUrl("https://static.8cache.com/cover/o/eJzLyTDW101J9HT0zC1wiwjw1Q8zCc_LynZPSTPz1HeEgsCCdP2SCveQojCjqCyvwFzd1DTnysyQqmyXrKQixyTLpCTzzEBnD1_9cjMD3QwLUwCPQRsh/phu-dung-hoa-som-no-toi-tan.jpg")
                    .build();
        expectation.add(novelByCat);
        // Use reflection to access the private static method
        Method method = Truyenfull_ScrapingService.class.getDeclaredMethod("extractNovelsFromPage", Document.class);
        method.setAccessible(true);
        // Act
        List<NovelByCatDTO> fact = (List<NovelByCatDTO>) method.invoke(null, document);
        // Assert
        assertNotNull(fact);
        // Replace the expected value based on the test HTML
        // assertEquals(expectation,fact);
    }
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetNovelsByCategory() throws Exception {
        String category = "đoản văn";
        int page = 40;
        String normalizedCategory = "doan-van";
        String url = "https://truyenfull.vn/the-loai/doan-van";
        Document document = Jsoup.connect(url).get();
        // Use reflection to access the private static method
        Method method = Truyenfull_ScrapingService.class.getDeclaredMethod("getTotalPages", Document.class);
        method.setAccessible(true);

        // Act
        int totalPages = (int) method.invoke(null, document);
        document = Jsoup.connect(url+"/trang-40").get();
        
        Method extractNovelsFromPageMethod = Truyenfull_ScrapingService.class.getDeclaredMethod("extractNovelsFromPage", Document.class);
        extractNovelsFromPageMethod.setAccessible(true);
        List<NovelByCatDTO> novels = (List<NovelByCatDTO>) extractNovelsFromPageMethod.invoke(scrapingService, document);
        scrapingService = new Truyenfull_ScrapingService();
        
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(category)).thenReturn(normalizedCategory);
        scrapingService.setStringManipulator(stringManipulator);

        NovelByCatResponse expectedResponse = NovelByCatResponse.builder()
                .novels(novels)
                .totalPages(totalPages)
                .currentPage(page)
                .build();
        System.out.print(category + page);
        // Act
        NovelByCatResponse actualResponse = scrapingService.getNovelsByCategory(category, 40);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse, actualResponse);
    }
    @Test
    public void testGetNovelDetail() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-sinh-nhuoc-mong";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        NovelDetailResponse actualResponse =  scrapingService.getNovelDetail("phù sinh nhược mộng");

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetNovelChapterList() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-dung-hoa-som-no-toi-tan";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        NovelChapterListResponse actualResponse =  scrapingService.getNovelChapterList("phù sinh nhược mộng",1);

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetNovelChapterContent() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-sinh-nhuoc-mong";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);
        // Act
        NovelChapterContentResponse actualResponse =  scrapingService.getNovelChapterContent("phù sinh nhược mộng","quyen-1-chuong-1");

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetCategories() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        // Act
        CategoriesResponse actualResponse =  scrapingService.getCategories();

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetNovelsFromPage() throws Exception {
        String url = "https://truyenfull.vn/tim-kiem/?tukhoa=h%E1%BB%87+th%E1%BB%91ng";
        // Use reflection to access the private static method
        Method method = Truyenfull_ScrapingService.class.getDeclaredMethod("getNovelsFromPage", String.class);
        method.setAccessible(true);
        // Act
        List<NovelByCatDTO> actualResponse = (List<NovelByCatDTO>) method.invoke(null, url);
        // Assert
        assertNotNull(actualResponse);
        assertFalse(actualResponse.isEmpty());
    }
    @Test
    public void testGetSearchResult() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        String keyword = "meo";
        int page = 1;
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        SearchResponse actualResponse =  scrapingService.getSearchResult(keyword, page);

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetDownloadContent() throws Exception {
        scrapingService = new Truyenfull_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-sinh-nhuoc-mong";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        NovelDetailResponse novelDetailResponse =  scrapingService.getNovelDetail("phù sinh nhược mộng");

        // Assert
        assertNotNull(novelDetailResponse);
        
        assertEquals("Phù Sinh Nhược Mộng", novelDetailResponse.getTitle());
        assertEquals("https://static.8cache.com/cover/o/eJzLyTDW101zDQ3NystzL3F11Q_LTSoLqShKdvfx1HeEAtfKSP1I87D4cDd3g2BjC_1yI0NT3QxjIyNdz2QTIwDMqhPI/phu-sinh-nhuoc-mong.jpg", novelDetailResponse.getImage());
        assertEquals("Lưu Diên Trường Ngưng", novelDetailResponse.getAuthor());
        assertEquals("vongtinhgiang.wordpress.com", novelDetailResponse.getSource());

    }
}
