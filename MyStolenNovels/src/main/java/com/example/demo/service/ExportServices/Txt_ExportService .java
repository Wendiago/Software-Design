package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.ArrayList;
import java.util.List;

@Service
class TxtExportService implements IExportServiceStrategy {
    private static final Logger log = LoggerFactory.getLogger(TxtExportService.class);

    @Override
    public byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception {
        String fileName = sanitizeFileName(novelDownloadContentDTO.getTitle()) + ".txt";
        String filePath = Paths.get(System.getProperty("user.dir"), fileName).toString();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePath))) {
            writer.write("Tên truyện: " + novelDownloadContentDTO.getTitle());
            writer.newLine();
            writer.write("Tác giả: " + novelDownloadContentDTO.getAuthor());
            writer.newLine();
            writer.write("Nguồn: " + novelDownloadContentDTO.getSource());
            writer.newLine();
            writer.newLine();

            List<NovelDownloadContentDTO.ChapterDTO> chapters = novelDownloadContentDTO.getChapters();
            for (NovelDownloadContentDTO.ChapterDTO chapter : chapters) {
                writer.write("Chương: " + chapter.getChapterTitle());
                writer.newLine();
                writer.write(chapter.getChapterContent());
                writer.newLine();
                writer.newLine();
            }

            log.info("TXT file created successfully.");
        } catch (IOException e) {
            log.error("Error while creating TXT file: ", e);
            throw new Exception("Error while creating TXT file", e);
        }

        // Convert the file to byte array to comply with the method's return type
        return java.nio.file.Files.readAllBytes(Paths.get(filePath));
    }

    private String sanitizeFileName(String title) {
        return title.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}
