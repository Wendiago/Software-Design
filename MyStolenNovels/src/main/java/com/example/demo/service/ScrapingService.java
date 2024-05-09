package com.example.demo.service;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.entity.Novel;
import com.example.demo.response.GET.GetNovelByCategoryResponse;
import com.example.demo.response.NovelByCatResponse;
import com.example.demo.utils.StringManipulator;
import lombok.ToString;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ScrapingService {
    private final StringManipulator stringManipulator = new StringManipulator();

    public static void main(String[] args) {
        int totalPages = 1;
        int currentPage = 3;
        String url = "https://truyenfull.vn/the-loai/trinh-tham/trang-";
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url + Integer.toString(currentPage)).get();

            //Parse row of novels
            Elements novelElements = document.select("div.row[itemtype=\"https://schema.org/Book\"]:not(#the-loai-show-ads)");

            totalPages = getTotalPages(document);
            System.out.println("Tong so trang: "+ totalPages);

            //Get current page novels
            String pageUrl = url + Integer.toString(currentPage);
            Document pageDoc = Jsoup.connect(pageUrl).get();
            List<NovelByCatDTO> novelOnPage = extractNovelsFromPage(pageDoc);
            System.out.println(novelOnPage);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static int getTotalPages(Document document){
        Elements pageLinks = document.select("ul.pagination.pagination-sm > li:not(.dropup.page-nav)");
        Element lastPageElement = pageLinks.last();
        if (lastPageElement != null) {
            String lastPageLink = lastPageElement.select("a").attr("href");
            return extractPageNumber(lastPageLink);
        }
        return 1; // Default to 1 page if unable to determine total pages
    }
    private static int extractPageNumber(String url) {
        // Extract the page number from the URL
        String pageNumberString = url.substring(url.lastIndexOf("-") + 1, url.lastIndexOf("/"));
        return Integer.parseInt(pageNumberString);
    }

    private static List<NovelByCatDTO> extractNovelsFromPage(Document document) {
        Elements novelElements = document.select("div.row[itemtype=\"https://schema.org/Book\"]:not(#the-loai-show-ads)");
        List<NovelByCatDTO> novelByCatList = new ArrayList<>();
        for (Element novelElement : novelElements) {
            NovelByCatDTO novelByCat = NovelByCatDTO.builder()
                    .title(novelElement.select("h3.truyen-title").text())
                    .author(novelElement.select("span.author").text())
                    .imageUrl(novelElement.select("div[data-classname=\"cover\"]").attr("data-image"))
                    .build();
            novelByCatList.add(novelByCat);
        }
        return novelByCatList;
    }
    public NovelByCatResponse getNovelsByCategory(String category, int page) throws Exception{
        //Normalize category string if necessary
        String normalizedCategory = stringManipulator.modify(category);

        String url = "https://truyenfull.vn/the-loai/" + normalizedCategory + "/trang-";
        int totalPages = 1;
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url + Integer.toString(page)).get();

            //Get total pages
            totalPages = getTotalPages(document);

            //Extract novels list
            List<NovelByCatDTO> novelByCat =  extractNovelsFromPage(document);

            return NovelByCatResponse.builder()
                    .novels(novelByCat)
                    .totalPages(totalPages)
                    .build();
        } catch (IOException e) {
            throw new Exception("Error fetching novels by category");
        }
    }

}
