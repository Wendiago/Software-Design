package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Pdf_ExportService implements IExportServiceStrategy{
    private static final Logger log = LoggerFactory.getLogger(Pdf_ExportService.class);

    @Override
    public byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception {
        return new byte[0];
    }
}
