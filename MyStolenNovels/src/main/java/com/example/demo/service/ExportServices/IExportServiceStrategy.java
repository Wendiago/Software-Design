package com.example.demo.service.ExportServices;

import com.example.demo.dto.NovelDownloadContentDTO;
import com.example.demo.response.NovelDownloadContentResponse;

public interface IExportServiceStrategy {
    byte[] exportNovel(NovelDownloadContentDTO novelDownloadContentDTO) throws Exception;
}
