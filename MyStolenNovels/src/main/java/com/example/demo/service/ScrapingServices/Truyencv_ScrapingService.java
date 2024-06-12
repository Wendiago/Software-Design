package com.example.demo.service.ScrapingServices;

import com.example.demo.dto.NovelByCatDTO;
import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.response.*;
import com.example.demo.utils.StringManipulator;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class Truyencv_ScrapingService implements IScrapingServiceStrategy {
    @Autowired
    private StringManipulator stringManipulator;
    public void setStringManipulator(StringManipulator stringManipulator) {
        this.stringManipulator = stringManipulator;
    }
    
    private static int getTotalPages(Document document){
        Elements pageLinks = document.getElementsByClass("flex mx-auto border border-solid border-[#dddddd] max-w-max items-center mt-[20px]");
        Element lastPageElement = pageLinks.select("li").last();
        if (lastPageElement != null) {
            String lastPageLink = lastPageElement.select("a").attr("href");
            System.out.println(lastPageLink);
            return extractPageNumber(lastPageLink);
        }
        return 1; // Default to 1 page if unable to determine total pages
    }
    private static int extractPageNumber(String url) {
        // Extract the page number from the URL
        String pageNumberString = url.substring(url.lastIndexOf("-")).replace("-","");
        return Integer.parseInt( pageNumberString);
    }

    private static List<NovelByCatDTO> extractNovelsFromPage(Document document) {
        Elements novelElements = document.getElementsByClass("grid grid-cols-12 border-b border-dashed border-[#999]");
        List<NovelByCatDTO> novelByCatList = new ArrayList<>();

        for (Element novelElement : novelElements) {
            NovelByCatDTO novelByCat = NovelByCatDTO.builder()
                    .title(novelElement.select("img").attr("alt"))
                    .author(novelElement.select("span").text())
                    .imageUrl(novelElement.select("img").attr("src"))
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
        String url = "https://truyencv.vn/the-loai/" + normalizedCategory + "/trang-";
        int totalPages = 1;
        try {
            // Send an HTTP GET request to the website
            Document documentTotalPages = Jsoup.connect("https://truyencv.vn/the-loai/" + normalizedCategory + "/").get();
            Document document = Jsoup.connect(url + Integer.toString(page)).get();

            //Get total pages
            totalPages = getTotalPages(documentTotalPages);

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
        String url = "https://truyencv.vn/" + stringManipulator.modify(novelTitle);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            //Info elements
            Elements infoElements = document.getElementsByClass("xl:col-span-8 flex flex-col");

            //Get title
            String title = document.getElementsByClass("uppercase text-center font-bold text-xl px-4 pb-2 mb-1").text();

            //Get image
            String selector = "img[alt=\"" + title + "\"]";
            String image = document.select(selector).attr("src");

            //Get author
            String author = infoElements.select("span[itemprop=name]").text();

            //Get genres
            Elements genreElements = document.getElementsByClass("hover:underline capitalize story-category mr-1");

            StringBuilder genres = new StringBuilder();
            for (Element genreElement : genreElements){
                if (!genres.isEmpty()){
                    genres.append(", ");
                }
                genres.append(genreElement.text());
            }

            //Get source
            String source = document.select("h1 a").attr("href");

            //Desc elements
            Elements descElements = document.select("div.desc");

            //Get rating
            String rating = document.select("span[itemprop=ratingValue]").text();

            //Get description
            String description = document.getElementById("gioi-thieu-truyen").text();

//            String book = "tt: "+ title + " img:"+ image + " auth:"+author + " genres:"+ String.valueOf(genres) +" src:"+ source +" rate:"+ rating +" des:"+ description;
//            System.out.print(book);
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
        // https://truyencv.vn/chi-ton-tu-la?page=2/
        String url = "https://truyencv.vn/" + stringManipulator.modify(novelTitle) + "?page=" + Integer.toString(page);
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            // Get total pages
            Element pageNumberString = document.getElementsByClass("flex mx-auto border border-solid border-[#dddddd] max-w-max items-center mt-[20px] flex-wrap").last();
            String totalPagesString = pageNumberString.select("a").last().attr("href");
            String totalPages = totalPagesString.substring(totalPagesString.lastIndexOf("?page=")).replace("?page=", "").replace("/#danh-sach-chuong", "");

            Elements chapterListElements = document.getElementsByClass("hover:underline block py-[2px] capitalize truncate");

            List<String> chapterList = new ArrayList<>();

            for (Element chapterListElement : chapterListElements) {
                chapterList.add(chapterListElement.text());
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
    public NovelChapterContentResponse getNovelChapterContent(String title, String chapterNumber) throws Exception{
        title = stringManipulator.modify(title);
        String url = "https://truyencv.vn/" + title + "/" + chapterNumber;
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            String chapterTitle = document.select("a.capitalize.flex.text-lg.max-w-max.m-auto.text-center.text-ellipsis.overflow-hidden").first().text();
            
            String novelTitletext = document.title();
            String delimiter = "-";
            // Find the index of the delimiter "-"
            int index = novelTitletext.indexOf(delimiter);

            // If the delimiter is found, extract the substring after it
            String novelTitle = (index != -1) ? novelTitletext.substring(index + 1) : novelTitletext;

            Elements elements = document.select("p.overflow-hidden.text-ellipsis.mb-8");
            // Iterate over the selected elements and print their content
            for (Element element : elements) {
                System.out.println(element.text());
            }

            // Extract text content from child nodes
            String content ="";
            String textContent ="";
            for (Element element : elements) {
                content = content + element.text() + "<br>";
                textContent = textContent +" " +element.text();
            }
           

            return NovelChapterContentResponse.builder()
                    .title(novelTitle)
                    .chapterNumber(chapterNumber)
                    .chapterTitle(chapterTitle)
                    .content(content)
                    .textContent(textContent)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public CategoriesResponse getCategories() throws Exception{
        String url = "https://truyencv.vn";
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            Elements categoryListElements = document.getElementsByClass("flex items-center h-[30px] pl-5");

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
    private static List<NovelByCatDTO> getNovelsFromPage(String url) throws IOException {
        List<NovelByCatDTO> novelList = new ArrayList<>();
        Document novelListDoc = Jsoup.connect(url).get();
            Elements novelListElements = novelListDoc.select("div[itemtype=\"https://schema.org/Book\"]");
            for (Element novel : novelListElements) {

                String image = novel.select("img[itemprop=image]").attr("src");

                String title = novel.select("a[itemprop=url]").text();
                String author = novel.select("span[itemprop=author]").text();

                List<String> statusList = new ArrayList<>();

                // Get newest chapter
                String newChapter = novel.select("a[rel=nofollow]").text();
                System.out.print(newChapter+"\n");
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

    @Override
    public SearchResponse getSearchResult(String keyword, int page) throws Exception{
        String url = "https://truyencv.vn/tim-kiem/?tukhoa=" + keyword;

        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();
            // Get total pages
            Elements pageElements = document.select("ul.pagination li:not(.dropup)");
            // log.info("Last page Element: {}", pageElements);
            int totalPages = 1;

            // If there is only 1 page
            if (pageElements.isEmpty()) {
                List<NovelByCatDTO> novelList = getNovelsFromPage(url);
                // log.info(novelList.toString());
                return SearchResponse.builder()
                        .novels(novelList)
                        .currentPage(page)
                        .totalPages(totalPages)
                        .build();
            } else {
                Element lastPageElement = pageElements.last();
                assert lastPageElement != null;
                String lastPageStr = lastPageElement.select("a").attr("title").trim();
                // log.info("Last Page Title Attribute: " + lastPageStr);
                System.out.println("Last Page Title Attribute: " + lastPageStr);
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
        String url = title;
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
                    // log.info("Reached {} requests. Sleeping for {} ms to prevent server overload...", REQUEST_THRESHOLD, SLEEP_DURATION_MS);
                    Thread.sleep(SLEEP_DURATION_MS);
                    requestCounter = 0;
                }
            }
            if (chapters.isEmpty()){
                throw new Exception("Cannot get download content from truyenfull source"+ "\n TEXT:"+ url);
            }
            return NovelDownloadContentDTO.builder()
                    .title(novelDetail.getTitle())
                    .image(novelDetail.getImage())
                    .author(novelDetail.getAuthor())
                    .source("truyencv.vn")
                    .chapters(chapters)
                    .build();
        }
        catch(Exception e){
            throw new Exception(e.getMessage()+ "\n TEXT:"+ url);
        }
    }
}
