package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.service.ExportServices.EpubExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class Main  {

    public static void main(String[] args) throws Exception {
        IExportServiceStrategy epubExportService = new EpubExportService();
        NovelDownloadContentDTO novelDownloadContentDTO = new NovelDownloadContentDTO();
        novelDownloadContentDTO.setTitle("Hokage: Hạch Độn Ninja");
        novelDownloadContentDTO.setAuthor("Lương Phan Cáp Mật Qua");
        novelDownloadContentDTO.setSource("https://truyencv.vn/hokage-hach-don-ninja/chuong-1");

        List<NovelDownloadContentDTO.ChapterDTO> chapters = new ArrayList<>();
        chapters.add(new NovelDownloadContentDTO.ChapterDTO("Chương 1", "This is the content of chapter 1."));
        chapters.add(new NovelDownloadContentDTO.ChapterDTO("Chương 2", "This is the content of chapter 2."));
        novelDownloadContentDTO.setChapters(chapters);

        try {
            byte[] exportedContent = epubExportService.exportNovel(novelDownloadContentDTO);

            String outputFilePath = System.getProperty("user.dir") + "/export_file.epub";
            Files.write(Paths.get(outputFilePath), exportedContent);

            System.out.println("EPUB file created successfully: " + outputFilePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
