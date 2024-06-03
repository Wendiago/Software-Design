package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;

public interface IExportServiceStrategy {
    byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception;
}
