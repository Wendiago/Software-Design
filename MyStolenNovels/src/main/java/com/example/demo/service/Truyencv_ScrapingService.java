package com.example.demo.service;

import com.example.demo.dto.NovelByCatDTO;
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

@Service
public class Truyencv_ScrapingService implements IScrapingServiceStrategy {
    @Autowired
    private static StringManipulator stringManipulator;


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
    public NovelChapterContentResponse getNovelChapterContent(String title, int chapterNumber) throws Exception{
        String url = "https://truyenfull.vn";
        try {
            // Send an HTTP GET request to the website
            Document document = Jsoup.connect(url).get();

            Elements categoryListElements = document.select("ul.control.navbar-nav div.dropdown-menu.multi-column ul.dropdown-menu li");

            List<String> categoryList = new ArrayList<>();
            for (Element categoryElement : categoryListElements){
                categoryList.add(categoryElement.select("a").text());
            }
            return NovelChapterContentResponse.builder().build();
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
}
