package com.example.demo.controller;

import com.example.demo.dto.DownloadRequestDTO;
import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.factory.ExportServiceFactory;
import com.example.demo.response.BaseResponse;
import com.example.demo.response.NovelDownloadContentResponse;
import com.example.demo.service.ExportServices.IExportServiceStrategy;
import com.example.demo.service.ScrapingServices.IScrapingServiceStrategy;
import com.example.demo.utils.MessageKeys;
import com.example.demo.utils.StringManipulator;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class ExportNovelController {
    private final ExportServiceFactory exportServiceFactory;
    private final ScrapingServiceFactory scrapingServiceFactory;
    private final StringManipulator stringModifier;
    private static final Logger log = LoggerFactory.getLogger(ExportNovelController.class);

    @GetMapping("/supportedFormats")
    public ResponseEntity<?> getSupportedFileFormat(){
        try{
            List<String> formats = exportServiceFactory.getAvailableFormat();
            return ResponseEntity.ok(BaseResponse.<List<String>>builder()
                    .status("Success")
                    .message(MessageKeys.GET_SUPPORTEDFORMAT_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(formats)
                    .build());
        }
        catch(Exception e){
            log.error("Error fetching sources");
            return ResponseEntity.internalServerError().body(
                    BaseResponse.<List<String>>builder()
                            .status("Failed")
                            .message(e.getMessage())
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
    @PostMapping("{title}/download")
    public ResponseEntity<?> downloadNovel(
            @RequestBody DownloadRequestDTO downloadRequestDT0,
            @PathVariable String title
    ) {
        List<String> sources = downloadRequestDT0.getSources();
        log.info("Export novel controller - sources: {}", sources);
        String downloadFormat = downloadRequestDT0.getFile_format();
        log.info("Export novel controller - file format: {}", downloadFormat);
        byte[] downloadContent = null;
        String succeededSource = "";

        for (String source : sources) {
            try {
                IScrapingServiceStrategy serviceStrategy = scrapingServiceFactory.getScrapingStrategy(source);
                IExportServiceStrategy exportServiceStrategy = exportServiceFactory.getExportStrategy(downloadFormat);

                NovelDownloadContentDTO novelContent = serviceStrategy.getDownloadContent(title);
                downloadContent = exportServiceStrategy.exportNovel(novelContent);
                succeededSource = source;
                break;
            } catch (Exception e) {
                log.error("Error downloading novel from {}, message: {}",source, e.getMessage());
            }
        }

        if (downloadContent != null){
            //Declare header
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", stringModifier.modify(title) + ".pdf");
            return new ResponseEntity<>(downloadContent, headers, HttpStatus.OK);
        }
        else {
            return ResponseEntity.internalServerError().body(
                    BaseResponse.<NovelDownloadContentResponse>builder()
                            .status("Failed")
                            .message("Failed to download novel from all sources")
                            .status_code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }
}
