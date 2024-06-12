package com.example.demo.service.ScrapingServices;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.response.*;
import com.example.demo.utils.HTTPClientRetry;
import com.example.demo.utils.StringManipulator;
import com.google.common.util.concurrent.RateLimiter;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class Truyenfull_ScrapingService implements IScrapingServiceStrategy {
    @Autowired
    private StringManipulator stringManipulator;
    public void setStringManipulator(StringManipulator stringManipulator) {
        this.stringManipulator = stringManipulator;
        this.httpClientRetry = new HTTPClientRetry();
    }
    

    @Autowired
    private HTTPClientRetry httpClientRetry;
    private static final Logger log = LoggerFactory.getLogger(Truyenfull_ScrapingService.class);

    //For getting download content
    private static final int MAX_RETRIES = 3;
    private static final int TIMEOUT = 10;
    private static final int RATE_LIMIT_DELAY = 500; //500ms between requests
    private static final double REQUESTS_PER_SECOND = 10.0;
    private RateLimiter rateLimiter = RateLimiter.create(REQUESTS_PER_SECOND);

    private static int getTotalPages(Document document) {
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
    public NovelByCatResponse getNovelsByCategory(String category, int page) throws Exception {
        //Normalize category string if necessary
        String normalizedCategory = stringManipulator.modify(category);

        String url = "https://truyenfull.vn/the-loai/" + normalizedCategory + "/trang-";
        int totalPages = 1;
        try {
            // Send an HTTP GET request to the website
            Document documentTotalPages = Jsoup.connect(url).get();
            Document document = Jsoup.connect(url + Integer.toString(page)).get();

            //Get total pages
            totalPages = getTotalPages(documentTotalPages);

            //Extract novels list
            List<NovelByCatDTO> novelByCat = extractNovelsFromPage(document);

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
        log.info("Get novel detail - novelTitle: {}", novelTitle);
        log.info("Get novel detail - url: {}", url);
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
            for (Element genreElement : genreElements) {
                if (!genres.isEmpty()) {
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
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    //Get novel chapter list
    @Override
    public NovelChapterListResponse getNovelChapterList(String novelTitle, int page) throws Exception {
        String url = "https://truyenfull.vn/" + stringManipulator.modify(novelTitle)
                + "/trang-" + Integer.toString(page);
        try {
            Document document = Jsoup.connect(url).get();

            //Get chapter number list
            String truyenId = document.select("#truyen-id").attr("value");
            log.info("getNovelChapterList: truyenId: {}", truyenId);

            String getChapterNumberListURL = "https://truyenfull.vn/ajax.php?type=chapter_option&data=" + truyenId;
            Document chapterListDocument = Jsoup.connect(getChapterNumberListURL).get();
            log.info("getNovelChapterList: chapterListDocument: {}", chapterListDocument);

            Elements chapterNumberListElements = chapterListDocument.select("option");
            List<String> chapterNumberList = chapterNumberListElements
                    .stream().map(Element::text).toList();
            List<String> rawChapterNumberList = chapterNumberListElements
                    .stream().map(e -> e.attr("value")).toList();

            // Get total pages
            String totalPages = document.select("input#total-page").attr("value");

            //Get chapter list elements
            Elements chapterListElements = document.select("div#list-chapter ul.list-chapter li");

            List<String> chapterList = new ArrayList<>();

            for (Element chapterListElement : chapterListElements) {
                chapterList.add(chapterListElement.select("a").text());
            }

            return NovelChapterListResponse.builder()
                    .novelTitle(novelTitle)
                    .chapterList(chapterList)
                    .chapterNumberList(chapterNumberList)
                    .rawChapterNumberList(rawChapterNumberList)
                    .currentPage(page)
                    .totalPages(Integer.parseInt(totalPages))
                    .build();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    //Get chapter content
    @Override
    public NovelChapterContentResponse getNovelChapterContent(String title, String chapterNumber) throws Exception {
        title = stringManipulator.modify(title);
        String url = "https://truyenfull.vn/" + title + "/" + chapterNumber;
        log.info("Constructed URL: {}", url);
        
        try { 
            URI uri = new URI(url);

            String htmlContent = httpClientRetry.getWithRetry(uri);
            if (htmlContent == null){
                throw new Exception("No content found");
            }
            
            Document document = Jsoup.parse(htmlContent);

            // Select the target element
            Element chapterC = document.select("#chapter-c.chapter-c").first();

            //Get raw text content
            String textContent = document.select("#chapter-c.chapter-c").text();

            if (chapterC == null) {
                throw new Exception("Chapter content not found in the document.");
            }

            // Remove the undesired elements
            chapterC.select("div.ads-responsive").remove();

            // Extract text content from child nodes
            String content = extractTextContent(chapterC);

            //Get title
            String novelTitle = document.select(".truyen-title").text();

            //Get chapter title
            String chapterTitle = document.select("a.chapter-title").text();
            //log.info("Get chapter content {}", textContent);
            return NovelChapterContentResponse.builder()
                    .title(novelTitle)
                    .chapterNumber(chapterNumber)
                    .chapterTitle(chapterTitle)
                    .content(content)
                    .textContent(textContent)
                    .build();
        } catch (Exception e) {
            throw new Exception(e.getMessage() +"URL: "+ url);
        }
    }

    private static String extractTextContent(Node node) {
        StringBuilder textContent = new StringBuilder();

        for (Node childNode : node.childNodes()) {
            if (childNode instanceof TextNode) {
                // Append text nodes directly
                textContent.append(((TextNode) childNode).text());
            } else if (childNode instanceof Element) {
                // Recursively extract text content from child elements
                textContent.append(extractTextContent(childNode));
            }
            // Check if the current child node is a <br> tag
            if (childNode.nodeName().equals("br")) {
                // Append <br> tag
                textContent.append("<br>");
            }
        }
        //Remove backlashes and spaces
        return textContent.toString().trim().replace("\\", "");
    }

    //Get all categories
    @Override
    public CategoriesResponse getCategories() throws Exception {
        String url = "https://truyenfull.vn";
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            Elements categoryListElements = document.select("ul.control.navbar-nav div.dropdown-menu.multi-column ul.dropdown-menu li");

            List<String> categoryList = new ArrayList<>();
            for (Element categoryElement : categoryListElements) {
                categoryList.add(categoryElement.select("a").text());
            }
            return CategoriesResponse.builder()
                    .categories(categoryList)
                    .build();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    private static List<NovelByCatDTO> getNovelsFromPage(String url) throws IOException {
        List<NovelByCatDTO> novelList = new ArrayList<>();
        Document novelListDoc = Jsoup.connect(url).get();
        Elements novelListElements = novelListDoc.select("div.list-truyen div.row[itemtype=\"https://schema.org/Book\"]");
        for (Element novel : novelListElements) {
            // Select the div element with data-classname="cover"
            Element coverDiv = novel.selectFirst("div[data-classname=cover]");
            String image = "";
            if (coverDiv != null) {
                // Get the data-desk-image attribute
                image = coverDiv.attr("data-desk-image");
            } else {
                image = novel.select("div.col-span-3 sm:col-span-2 py-3").attr("data-image");
            }
            String title = novel.select(".truyen-title").text();
            String author = novel.select(".author").text();

            // Get status tags
            Elements hotLabel = novel.select(".label-hot");
            Elements fullLabel = novel.select(".label-full");
            List<String> statusList = new ArrayList<>();
            if (!hotLabel.isEmpty()) {
                statusList.add("Hot");
            }
            if (!fullLabel.isEmpty()) {
                statusList.add("Full");
            }

            // Get newest chapter
            String newChapter = novel.select(".text-info").text();

            NovelByCatDTO novelItem = NovelByCatDTO.builder()
                    .title(title)
                    .imageUrl(image)
                    .author(author)
                    .status(statusList)
                    .newChapter(newChapter)
                    .build();
            novelList.add(novelItem);
        }
        return novelList;
    }

    //Get search results
    @Override
    public SearchResponse getSearchResult(String keyword, int page) throws Exception {
        String url = "https://truyenfull.vn/tim-kiem/?tukhoa=" + keyword;

        try {
            Document document = Jsoup.connect(url).get();
            // Get total pages
            Elements pageElements = document.select("ul.pagination li:not(.dropup)");
            log.info("Last page Element: {}", pageElements);
            int totalPages = 1;

            // If there is only 1 page
            if (pageElements.isEmpty()) {
                List<NovelByCatDTO> novelList = getNovelsFromPage(url);
                log.info(novelList.toString());
                return SearchResponse.builder()
                        .novels(novelList)
                        .currentPage(page)
                        .totalPages(totalPages)
                        .build();
            } else {
                Element lastPageElement = pageElements.last();
                assert lastPageElement != null;
                String lastPageStr = lastPageElement.select("a").attr("title").trim();
                log.info("Last Page Title Attribute: " + lastPageStr);

                // Extract the last number from the string
                Pattern pattern = Pattern.compile("(\\d+)$");
                Matcher matcher = pattern.matcher(lastPageStr);
                if (matcher.find()) {
                    totalPages = Integer.parseInt(matcher.group(1));
                }
                // If page request exceeds total pages
                if (totalPages < page) {
                    page = totalPages;
                }

                List<NovelByCatDTO> novelList = getNovelsFromPage(url + "&page=" + page);
                return SearchResponse.builder()
                        .novels(novelList)
                        .currentPage(page)
                        .totalPages(totalPages)
                        .build();
            }
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public NovelDownloadContentDTO getDownloadContent(String title) throws Exception{
        int requestCounter = 0; // Initialize the request counter
        final int REQUEST_THRESHOLD = 50; // Define the threshold
        final int SLEEP_DURATION_MS = 10000;

        try{
            NovelDetailResponse novelDetail = this.getNovelDetail(title);
            //log.info("Download content - novel detail: {}", novelDetail);

            NovelChapterListResponse chapterList = this.getNovelChapterList(title, 1);
            //log.info("Download content - chapter list: {}", chapterList);

            List<NovelDownloadContentDTO.ChapterDTO> chapters = new ArrayList<>();
            List<String> chapterNumberList = chapterList.getRawChapterNumberList();

            //log.info("Download content - chapterNumberList: {}", chapterNumberList);

            for (String chapterNumber : chapterNumberList){
                NovelChapterContentResponse chapterContentResponse = this.getNovelChapterContent(title, chapterNumber);
                //log.info("Download content - chapter content: {}", chapterContentResponse);
                NovelDownloadContentDTO.ChapterDTO chapterInfo = NovelDownloadContentDTO.ChapterDTO.builder()
                        .chapterTitle(chapterContentResponse.getChapterTitle())
                        .chapterContent(chapterContentResponse.getTextContent())
                        .build();
                //log.info("Download content - chapter: {}", chapterInfo);
                if (chapterInfo != null){
                    chapters.add(chapterInfo);
                    //log.info("Download content - chapters: {}", chapters);
                }

                requestCounter++; // Increment the counter

                if (requestCounter >= REQUEST_THRESHOLD) {
                    // Sleep to prevent overloading the server
                    log.info("Reached {} requests. Sleeping for {} ms to prevent server overload...", REQUEST_THRESHOLD, SLEEP_DURATION_MS);
                    Thread.sleep(SLEEP_DURATION_MS);
                    requestCounter = 0;
                }
            }
            if (chapters.isEmpty()){
                throw new Exception("Cannot get download content from truyenfull source");
            }
            return NovelDownloadContentDTO.builder()
                    .title(novelDetail.getTitle())
                    .image(novelDetail.getImage())
                    .author(novelDetail.getAuthor())
                    .source("truyenfull.vn")
                    .chapters(chapters)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
