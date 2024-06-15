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
import com.example.demo.service.ScrapingServices.Truyencv_ScrapingService;
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
import static org.mockito.Mockito.when;

class Truyencv_ScrapingServiceTest {
    private static Truyencv_ScrapingService scrapingService;
    @BeforeAll
    public static void setUpClass() {
        scrapingService = new Truyencv_ScrapingService();
    }
    @Mock
    private StringManipulator stringManipulator;

    @Test
    public void testGetTotalPages() throws Exception {
        String url = "https://truyencv.vn/the-loai/kiem-hiep";
        Document document = Jsoup.connect(url).get();
        // Use reflection to access the private static method
        Method method = Truyencv_ScrapingService.class.getDeclaredMethod("getTotalPages", Document.class);
        method.setAccessible(true);

        // Act
        int totalPages = (int) method.invoke(null, document);

        // Assert
        assertNotNull(totalPages);
        // Replace the expected value based on the test HTML
        assertEquals(100, totalPages);
    }
    @Test
    public void testExtractNovelsFromPage() throws Exception {
        String url = "https://truyencv.vn/the-loai/bach-hop/trang-65";
        Document document = Jsoup.connect(url).get();
        List<NovelByCatDTO> expectation = new ArrayList<>();
        NovelByCatDTO novelByCat = NovelByCatDTO.builder()
                    .title("Phù Sinh Nhược Mộng")
                    .author("Lưu Diên Trường Ngưng")
                    .imageUrl("https://static.truyencv.vn/images/phu-sinh-nhuoc-mong.jpg")
                    .build();
        expectation.add(novelByCat);
        // Use reflection to access the private static method
        Method method = Truyencv_ScrapingService.class.getDeclaredMethod("extractNovelsFromPage", Document.class);
        method.setAccessible(true);
        // Act
        List<NovelByCatDTO> fact = (List<NovelByCatDTO>) method.invoke(null, document);
        // Assert
        assertNotNull(fact);
        // Replace the expected value based on the test HTML
        assertFalse(fact.isEmpty());
    }
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetNovelsByCategory() throws Exception {
        String category = "bách hợp";
        int page = 67;
        String normalizedCategory = "bach-hop";
        String url = "https://truyencv.vn/the-loai/bach-hop";
        Document document = Jsoup.connect(url).get();
        // Use reflection to access the private static method
        Method method = Truyencv_ScrapingService.class.getDeclaredMethod("getTotalPages", Document.class);
        method.setAccessible(true);

        // Act
        int totalPages = (int) method.invoke(null, document);
        document = Jsoup.connect(url+"/trang-"+page).get();
        Method extractNovelsFromPageMethod = Truyencv_ScrapingService.class.getDeclaredMethod("extractNovelsFromPage", Document.class);
        extractNovelsFromPageMethod.setAccessible(true);
        List<NovelByCatDTO> novels = (List<NovelByCatDTO>) extractNovelsFromPageMethod.invoke(scrapingService, document);
        scrapingService = new Truyencv_ScrapingService();
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(category)).thenReturn(normalizedCategory);
        scrapingService.setStringManipulator(stringManipulator);


        NovelByCatResponse expectedResponse = NovelByCatResponse.builder()
                .novels(novels)
                .totalPages(totalPages)
                .currentPage(page)
                .build();
        // Act
        NovelByCatResponse actualResponse = scrapingService.getNovelsByCategory("bách hợp", page);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse, actualResponse);
    }
    @Test
    public void testGetNovelDetail() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
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
        assertEquals("Phù Sinh Nhược Mộng", actualResponse.getTitle());
    }
    @Test
    public void testGetNovelChapterList() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-sinh-nhuoc-mong";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        NovelChapterListResponse actualResponse =  scrapingService.getNovelChapterList("phù sinh nhược mộng",1);

        // Assert
        assertNotNull(actualResponse);
        assertFalse(actualResponse.getChapterList().isEmpty());
    }
    @Test
    public void testGetNovelChapterContent() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
        String title = "phù sinh nhược mộng";
        String normalizedtitle = "phu-sinh-nhuoc-mong";
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        when(stringManipulator.modify(title)).thenReturn(normalizedtitle);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        NovelChapterContentResponse actualResponse =  scrapingService.getNovelChapterContent("phù sinh nhược mộng","chuong-1");

        // Assert
        assertNotNull(actualResponse);
        assertFalse(actualResponse.getTextContent().isEmpty());

    }
    @Test
    public void testGetCategories() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
        // Act
        CategoriesResponse actualResponse =  scrapingService.getCategories();

        // Assert
        assertNotNull(actualResponse);
    }
    @Test
    public void testGetNovelsFromPage() throws Exception {
        String url = "https://truyencv.vn/danh-sach/truyen-moi/trang-3137";
        // Use reflection to access the private static method
        Method method = Truyencv_ScrapingService.class.getDeclaredMethod("getNovelsFromPage", String.class);
        method.setAccessible(true);
        // Act
        List<NovelByCatDTO> actualResponse = (List<NovelByCatDTO>) method.invoke(null, url);
        // Assert
        assertNotNull(actualResponse);
        assertFalse(actualResponse.isEmpty());
    }
    @Test
    public void testGetSearchResult() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
        String keyword = "meo";
        int page = 1;
        // Mock the StringManipulator
        StringManipulator stringManipulator = Mockito.mock(StringManipulator.class);
        scrapingService.setStringManipulator(stringManipulator);

        // Act
        SearchResponse actualResponse =  scrapingService.getSearchResult(keyword, page);

        // Assert
        assertNotNull(actualResponse);
        assertFalse(actualResponse.getNovels().isEmpty());

    }
    @Test
    public void testGetDownloadContent() throws Exception {
        scrapingService = new Truyencv_ScrapingService();
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
        assertEquals("https://static.truyencv.vn/images/phu-sinh-nhuoc-mong.jpg", novelDetailResponse.getImage());
        assertEquals("Lưu Diên Trường Ngưng", novelDetailResponse.getAuthor());
        assertEquals("https://truyencv.vn/phu-sinh-nhuoc-mong", novelDetailResponse.getSource());

    }
}
