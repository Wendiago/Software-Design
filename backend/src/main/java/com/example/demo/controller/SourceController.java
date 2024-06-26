package com.example.demo.controller;

import com.example.demo.factory.ScrapingServiceFactory;
import com.example.demo.response.BaseResponse;
import com.example.demo.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}")
@RequiredArgsConstructor
public class SourceController {
    private final ScrapingServiceFactory scrapingFactory;
    private final Logger log = LoggerFactory.getLogger(SourceController.class);
    @GetMapping("/sources")
    public ResponseEntity<?> getSources(){
        try{
            List<String> sources = scrapingFactory.getAvailableSources();
            Collections.reverse(sources);
            //log.info(sources.toString());
            return ResponseEntity.ok(BaseResponse.<List<String>>builder()
                    .status("Success")
                    .message(MessageKeys.GET_SOURCES_SUCCESSFULLY)
                    .status_code(HttpStatus.OK.value())
                    .data(sources)
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
}
