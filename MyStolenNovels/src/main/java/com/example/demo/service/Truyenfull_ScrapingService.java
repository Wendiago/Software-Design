package com.example.demo.service;

import com.example.demo.controller.NovelFetchingController;
import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.response.*;
import com.example.demo.utils.StringManipulator;
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

import javax.print.Doc;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class Truyenfull_ScrapingService implements IScrapingServiceStrategy {
    @Autowired
    private StringManipulator stringManipulator;
    private static final Logger log = LoggerFactory.getLogger(Truyenfull_ScrapingService.class);

    public static void main(String[] arg) throws Exception {
        String keyword = "loan";
        String url = "https://truyenfull.vn/tim-kiem/?tukhoa=" + keyword;
        try {
            Document document = Jsoup.connect(url).get();

            //Get total pages
            Elements lastPageElements = document.select("ul.pagination li:last-child a");
            int totalPages = 1;
            //If there is only 1 page
            if (lastPageElements.isEmpty()) {
                //
            } else {
                String lastPageUrl = lastPageElements.attr("href");
                URI uri = new URI(lastPageUrl);
                String query = uri.getQuery();
                String[] params = query.split("&");
                totalPages = Arrays.stream(params)
                        .filter(param -> param.startsWith("page="))
                        .map(param -> param.split("=")[1])
                        .mapToInt(Integer::parseInt)
                        .findFirst()
                        .orElse(1);

                //Get novels
                List<NovelByCatDTO> novelList = new ArrayList<>();
                //Get each page
                Document novelListDoc = Jsoup.connect(url + "&page=" + Integer.toString(1)).get();
                Elements novelListElements = novelListDoc
                        .select("div.list-truyen div.row[itemtype=\"https://schema.org/Book\"]");
                //System.out.println(novelListElements);
                for (Element novel : novelListElements) {
                    String image = novel.select("div[data-classname=\"cover\"]").attr("data-image");
                    String title = novel.select(".truyen-title").text();
                    String author = novel.select(".author").text();
                    NovelByCatDTO novelItem = NovelByCatDTO.builder()
                            .title(title)
                            .imageUrl(image)
                            .author(author)
                            .build();
                    novelList.add(novelItem);
                }
                System.out.println(novelList);
            }

        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

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
            Document document = Jsoup.connect(url + Integer.toString(page)).get();

            //Get total pages
            totalPages = getTotalPages(document);

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
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            // Get total pages
            String totalPages = document.select("input#total-page").attr("value");

            //Get chapter list elements
            Elements chapterListElements = document.select("div#list-chapter ul.list-chapter li");

            List<String> chapterList = new ArrayList<>();

            for (Element chapterListElement : chapterListElements) {
                chapterList.add(chapterListElement.select("a").text());
            }

            //Get total chapters
            String getTotalChapter_url = "https://truyenfull.vn/" + stringManipulator.modify(novelTitle)
                    + "/trang-" + totalPages;
            Document getTotalChapter_doc = Jsoup.connect(getTotalChapter_url).get();
            String totalChaptersURL = getTotalChapter_doc.select("ul.list-chapter li:last-child a").attr("href");
            int lastIndex = totalChaptersURL.lastIndexOf("/chuong-");
            String totalChaptersStr = totalChaptersURL.substring(lastIndex + "/chuong-".length(), totalChaptersURL.length() - 1);

            return NovelChapterListResponse.builder()
                    .novelTitle(novelTitle)
                    .chapterList(chapterList)
                    .totalChapters(Integer.parseInt(totalChaptersStr))
                    .currentPage(page)
                    .totalPages(Integer.parseInt(totalPages))
                    .build();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    //Get chapter content
    @Override
    public NovelChapterContentResponse getNovelChapterContent(String title, int chapterNumber) throws Exception {
        String url = "https://truyenfull.vn/" + stringManipulator.modify(title) + "/chuong-"
                + Integer.toString(chapterNumber) + "/";
        log.info("Constructed URL: {}", url);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            Element chapterC = document.select("#chapter-c.chapter-c").first();


            StringBuilder textContent = new StringBuilder();
            assert chapterC != null;
            for (Node childNode : chapterC.childNodes()) {
                if (childNode instanceof TextNode) {
                    textContent.append(((TextNode) childNode).text());
                } else if (childNode.nodeName().equals("br")) {
                    textContent.append("<br>");
                }
            }
            String content = textContent.toString().trim();
            String chapterTitle = document.select("a.chapter-title").text();
            log.info("Get chapter content {}", textContent);
            return NovelChapterContentResponse.builder()
                    .title(title)
                    .chapterNumber(chapterNumber)
                    .chapterTitle(chapterTitle)
                    .content(content)
                    .build();
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
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

    private List<NovelByCatDTO> getNovelsFromPage(String url) throws IOException {
        List<NovelByCatDTO> novelList = new ArrayList<>();
        Document novelListDoc = Jsoup.connect(url).get();
        Elements novelListElements = novelListDoc.select("div.list-truyen div.row[itemtype=\"https://schema.org/Book\"]");

        for (Element novel : novelListElements) {
            String image = novel.select("div[data-classname=\"cover\"]").attr("data-image");
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
        //keyword = stringManipulator.urlEncode(keyword);
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
}
