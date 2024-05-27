package com.example.demo.service;

import com.example.demo.controller.NovelFetchingController;
import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.response.*;
import com.example.demo.utils.StringManipulator;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class Truyenfull_ScrapingService implements IScrapingServiceStrategy {
    @Autowired
    private StringManipulator stringManipulator;
    private static final Logger log = LoggerFactory.getLogger(Truyenfull_ScrapingService.class);
    public static void main (String []arg) throws Exception {
        String title = "linh-vu-thien-ha";
        int chapterNumber = 12;
        String url = "https://truyenfull.vn/" + title + "/chuong-"
                + Integer.toString(chapterNumber);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            String content = document.select("#chapter-c.chapter-c").text();
            NovelChapterContentResponse res = NovelChapterContentResponse.builder()
                    .title(title)
                    .chapterNumber(chapterNumber)
                    .content(content)
                    .build();
            System.out.println(res);
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
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

    //Get novels by category
    @Override
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
                    .currentPage(page)
                    .build();
        } catch (IOException e) {
            throw new Exception("Error fetching novels by category");
        }
    }

    //Get novel detail information
    @Override
    public NovelDetailResponse getNovelDetail(String novelTitle) throws Exception {
        String url = "https://truyenfull.vn/" + stringManipulator.modify(novelTitle);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            //Info elements
            Elements infoElements = document.select("div.col-info-desc");

            //Get title
            String title = infoElements.select("h3.title").text();

            //Get image
            String image = infoElements.select("div.info-holder .book img").attr("src");

            //Get author
            String author = infoElements.select("div.info div:has(h3:contains(Tác giả)) a").text();

            //Get genres
            Elements genreElements = infoElements.select("div.info div:has(h3:contains(Thể loại)) a");

            StringBuilder genres = new StringBuilder();
            for (Element genreElement : genreElements){
                if (!genres.isEmpty()){
                    genres.append(", ");
                }
                genres.append(genreElement.attr("title"));
            }

            //Get source
            String source = infoElements.select("div.info div:has(h3:contains(Nguồn)) .source").text();

            //Desc elements
            Elements descElements = document.select("div.desc");

            //Get rating
            String rating = descElements.select("div.rate span[itemprop=ratingValue]").text();

            //Get description
            String description = descElements.select("div[itemprop=description]").text();

            return NovelDetailResponse.builder()
                    .title(title)
                    .image(image)
                    .author(author)
                    .genres(String.valueOf(genres))
                    .source(source)
                    .rating(rating)
                    .description(description)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }

    //Get novel chapter list
    @Override
    public NovelChapterListResponse getNovelChapterList(String novelTitle, int page) throws Exception{
        String url = "https://truyenfull.vn/" + stringManipulator.modify(novelTitle) + "/trang-" + Integer.toString(page);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            // Get total pages
            String totalPages = document.select("input#total-page").attr("value");

            //Get chapter list elements
            Elements chapterListElements = document.select("div#list-chapter ul.list-chapter li");

            List<String> chapterList = new ArrayList<>();

            for (Element chapterListElement : chapterListElements){
                chapterList.add(chapterListElement.select("a").text());
            }

            return NovelChapterListResponse.builder()
                    .novelTitle(novelTitle)
                    .chapterList(chapterList)
                    .currentPage(page)
                    .totalPages(Integer.parseInt(totalPages))
                    .build();
        }
        catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }

    //Get chapter content
    @Override
    public NovelChapterContentResponse getNovelChapterContent(String title, int chapterNumber) throws Exception{
        String url = "https://truyenfull.vn/" + stringManipulator.modify(title) + "/chuong-"
                + Integer.toString(chapterNumber);
        log.info("Constructed URL: {}", url);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            String content = document.select("#chapter-c.chapter-c").text();
            log.info("Get chapter content {}", content);
            return NovelChapterContentResponse.builder()
                    .title(title)
                    .chapterNumber(chapterNumber)
                    .content(content)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }


    //Get all categories
    @Override
    public CategoriesResponse getCategories() throws Exception{
        String url = "https://truyenfull.vn";
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            Elements categoryListElements = document.select("ul.control.navbar-nav div.dropdown-menu.multi-column ul.dropdown-menu li");

            List<String> categoryList = new ArrayList<>();
            for (Element categoryElement : categoryListElements){
                categoryList.add(categoryElement.select("a").text());
            }
            return CategoriesResponse.builder()
                    .categories(categoryList)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
