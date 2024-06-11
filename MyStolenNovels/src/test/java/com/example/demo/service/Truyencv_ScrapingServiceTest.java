package com.example.demo.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.factory.ScrapingServiceFactory;
import com.example.demo.response.NovelByCatResponse;
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
        assertEquals(99, totalPages);
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
        assertEquals(expectation,fact);
    }
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetNovelsByCategory() throws Exception {
        String category = "bách hợp";
        int page = 65;
        String normalizedCategory = "bach-hop";
        String url = "https://truyencv.vn/the-loai/bach-hop";
        Document document = Jsoup.connect(url).get();
        // Use reflection to access the private static method
        Method method = Truyencv_ScrapingService.class.getDeclaredMethod("getTotalPages", Document.class);
        method.setAccessible(true);

        // Act
        int totalPages = (int) method.invoke(null, document);
        document = Jsoup.connect(url+"/trang-65").get();
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
        System.out.print(category + page);
        // Act
        NovelByCatResponse actualResponse = scrapingService.getNovelsByCategory("bách hợp", 65);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(expectedResponse, actualResponse);
    }
    
}
