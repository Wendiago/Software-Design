package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class Pdf_ExportService implements IExportServiceStrategy {
    private static final Logger log = LoggerFactory.getLogger(Pdf_ExportService.class);

    private static final float MARGIN = 30;
    private static final float FONT_SIZE = 12;
    private static final float TITLE_FONT_SIZE = 40;
    private static final float LEADING = 1.5f * FONT_SIZE;
    private static final float TITLE_LEADING = 1.5f * TITLE_FONT_SIZE;
    private static final PDRectangle PAGE_SIZE = PDRectangle.A4;
    private static final float PAGE_HEIGHT = PAGE_SIZE.getHeight() - 2 * MARGIN;
    private static final float PAGE_WIDTH = PAGE_SIZE.getWidth() - 2 * MARGIN;

    @Override
    public byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            InputStream fontStream = getClass().getResourceAsStream("/fonts/NotoSans-Regular.ttf");
            InputStream boldStream = getClass().getResourceAsStream("/fonts/NotoSans-Bold.ttf");
            PDType0Font font = PDType0Font.load(document, fontStream, false);
            PDType0Font boldFont = PDType0Font.load(document, boldStream, false);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                addBasicInformation(
                        contentStream, font, boldFont, novelDownloadContentDTO.getTitle()
                        , novelDownloadContentDTO.getAuthor(), novelDownloadContentDTO.getSource()
                );
            }

            addChapters(document, font, boldFont, novelDownloadContentDTO.getChapters());
            document.save(byteArrayOutputStream);
            log.info("PDF created successfully.");
        } catch (IOException e) {
            log.error("Error while creating PDF: ", e);
            throw new Exception("Error while creating PDF", e);
        }
        return byteArrayOutputStream.toByteArray();
    }

    private void addBasicInformation(
            PDPageContentStream contentStream, PDType0Font font, PDType0Font boldFont, String title
            , String author, String source
    ) throws IOException {
        //Add novel title
        contentStream.beginText();
        contentStream.setFont(boldFont, TITLE_FONT_SIZE);
        contentStream.setLeading(TITLE_LEADING);

        float yPosition = PAGE_HEIGHT - MARGIN - TITLE_FONT_SIZE;
        contentStream.newLineAtOffset(MARGIN, yPosition);

        String[] words = title.split(" ");
        StringBuilder line = new StringBuilder();
        for (String word : words) {
            String testLine = line + word + " ";
            //log.info("Test line {}", testLine);
            float testWidth = boldFont.getStringWidth(testLine) / 1000 * TITLE_FONT_SIZE;
            //log.info("Test width {}", testWidth);
            //log.info("Page width {}", PAGE_WIDTH);
            if (testWidth > PAGE_WIDTH) {
                contentStream.showText(line.toString());
                line = new StringBuilder(word).append(" ");
                contentStream.newLine();
                yPosition -= TITLE_LEADING;
            } else {
                line.append(word).append(" ");
            }
        }
        if (!line.isEmpty()) {
            contentStream.showText(line.toString());
        }
        contentStream.endText();

        //Add novel author
        contentStream.beginText();
        contentStream.setFont(font, 18);
        yPosition -= TITLE_LEADING;
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText("Tác giả: " + author);
        contentStream.endText();

        //Add source
        contentStream.beginText();
        contentStream.setFont(font, 12);
        yPosition -= 18;
        contentStream.setNonStrokingColor(Color.GRAY);
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText("Nguồn: " + source);
        contentStream.endText();
        contentStream.setNonStrokingColor(Color.BLACK);
    }

    private void addChapters(PDDocument document, PDType0Font font, PDType0Font boldFont, List<NovelDownloadContentDTO.ChapterDTO> chapters) throws IOException {
        for (NovelDownloadContentDTO.ChapterDTO chapter : chapters) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            float yPosition = PAGE_HEIGHT - MARGIN;

            // Write chapter title
            try (PDPageContentStream titleStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true)) {
                titleStream.beginText();
                titleStream.setFont(boldFont, 20);
                titleStream.newLineAtOffset(MARGIN, yPosition);
                titleStream.showText(chapter.getChapterTitle());
                titleStream.endText();
            }

            yPosition -= 2 * LEADING; // Move down for chapter content

            // Initialize content stream for chapter content
            PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
            contentStream.setFont(font, FONT_SIZE);
            contentStream.setLeading(LEADING);
            contentStream.beginText();
            contentStream.newLineAtOffset(MARGIN, yPosition);

            String[] words = chapter.getChapterContent().split(" ");
            StringBuilder line = new StringBuilder();

            for (String word : words) {
                word = replaceUnsupportedCharacters(word);
                String testLine = line.toString() + word + " ";
                float testWidth = font.getStringWidth(testLine) / 1000 * FONT_SIZE;

                if (testWidth > PAGE_WIDTH) {
                    contentStream.showText(line.toString());
                    contentStream.newLine();
                    yPosition -= LEADING;

                    // Check if we need a new page
                    if (yPosition <= MARGIN) {
                        contentStream.endText();
                        contentStream.close();

                        page = new PDPage(PDRectangle.A4);
                        document.addPage(page);
                        yPosition = PAGE_HEIGHT - MARGIN;

                        // Add a new content stream for the new page in append mode
                        contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
                        contentStream.setFont(font, FONT_SIZE);
                        contentStream.setLeading(LEADING);
                        contentStream.beginText();
                        contentStream.newLineAtOffset(MARGIN, yPosition);
                    }
                    line = new StringBuilder();
                }
                //log.info(word);
                line.append(word).append(" ");
            }

            // Show the remaining text
            if (!line.isEmpty()) {
                contentStream.showText(line.toString());
            }
            contentStream.endText();
            contentStream.close();
        }
    }

    private String replaceUnsupportedCharacters(String text) {
        // Define a regex pattern to match allowed characters
        String regex = "[\\p{ASCII}ÁÀẢÃẠÂẤẦẨẪẬĂẮẰẲẴẶĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴáàảãạâấầẩẫậăắằẳẵặéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]";

        // Keep only the characters that match the pattern
        return text.replaceAll("[^" + regex + "]", ""); // Replace characters not in the whitelist
    }
}
