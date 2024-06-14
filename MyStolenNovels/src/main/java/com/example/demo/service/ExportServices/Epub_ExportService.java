package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import nl.siegmann.epublib.domain.Book;
import nl.siegmann.epublib.domain.Author;
import nl.siegmann.epublib.domain.Resource;
import nl.siegmann.epublib.epub.EpubWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
@Service
class EpubExportService implements IExportServiceStrategy {
    private static final Logger log = LoggerFactory.getLogger(EpubExportService.class);

    @Override
    public byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception {
        String fileName = sanitizeFileName(novelDownloadContentDTO.getTitle()) + ".epub";
        Path filePath = Paths.get(System.getProperty("user.dir"), fileName);

        Book book = new Book();
        book.getMetadata().addTitle(novelDownloadContentDTO.getTitle());
        book.getMetadata().addAuthor(new nl.siegmann.epublib.domain.Author(novelDownloadContentDTO.getAuthor()));

        List<NovelDownloadContentDTO.ChapterDTO> chapters = novelDownloadContentDTO.getChapters();
        for (NovelDownloadContentDTO.ChapterDTO chapter : chapters) {
            book.addSection(chapter.getChapterTitle(), new Resource(chapter.getChapterContent().getBytes(), chapter.getChapterTitle() + ".html"));
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        EpubWriter epubWriter = new EpubWriter();

        try {
            epubWriter.write(book, out);
            Files.write(filePath, out.toByteArray());
            log.info("EPUB file created successfully.");
        } catch (IOException e) {
            log.error("Error while creating EPUB file: ", e);
            throw new Exception("Error while creating EPUB file", e);
        }

        return out.toByteArray();
    }

    private String sanitizeFileName(String title) {
        return title.replaceAll("[^a-zA-Z0-9.-]", "_");
    }
}