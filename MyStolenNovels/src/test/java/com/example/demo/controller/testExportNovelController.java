package com.example.demo.controller;

import com.example.demo.dto.DownloadRequestDTO;
import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.factory.ExportServiceFactory;
import com.example.demo.factory.ScrapingServiceFactory;
import com.example.demo.response.BaseResponse;
import com.example.demo.service.ExportServices.IExportServiceStrategy;
import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
import com.example.demo.utils.StringManipulator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExportNovelControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ExportServiceFactory exportServiceFactory;

    @MockBean
    private ScrapingServiceFactory scrapingServiceFactory;

    @MockBean
    private StringManipulator stringManipulator;

    @BeforeEach
    public void setup() {
        when(exportServiceFactory.getAvailableFormat()).thenReturn(Arrays.asList("PDF", "EPUB"));
    }

    @Test
    public void testGetSupportedFileFormat() throws Exception {
        mockMvc.perform(get("/api/supportedFormats"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json("{\"status\":\"Success\",\"message\":\"GET_SUPPORTEDFORMAT_SUCCESSFULLY\",\"status_code\":200,\"data\":[\"PDF\",\"EPUB\"]}"));
    }

    @Test
    public void testDownloadNovel() throws Exception {
        // Mocking the scraping and export services
        IScrapingServiceStrategy scrapingServiceStrategy = new IScrapingServiceStrategy();
        when(scrapingServiceFactory.getScrapingStrategy(anyString())).thenReturn(scrapingServiceStrategy);

        IExportServiceStrategy exportServiceStrategy = (novelDownloadContentDTO) -> "test-content".getBytes();

        when(scrapingServiceFactory.getScrapingStrategy(anyString())).thenReturn(scrapingServiceStrategy);
        when(exportServiceFactory.getExportStrategy(anyString())).thenReturn(exportServiceStrategy);
        when(stringManipulator.modify(anyString())).thenReturn("test_novel");

        DownloadRequestDTO downloadRequestDTO = new DownloadRequestDTO();
        downloadRequestDTO.setSources(Collections.singletonList("test-source"));
        downloadRequestDTO.setFile_format("PDF");

        mockMvc.perform(post("/api/Test Novel/download")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"sources\":[\"test-source\"],\"file_format\":\"PDF\"}"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF));
    }
}