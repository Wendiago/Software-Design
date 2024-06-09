package com.example.demo.utils;

import com.example.demo.service.ScrapingServices.Truyenfull_ScrapingService;
import org.apache.http.HttpEntity;
import org.apache.http.client.HttpResponseException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.util.concurrent.TimeUnit;

@Component
public class HTTPClientRetry {
    private static final int MAX_RETRIES = 3;
    private static final int DELAY_TIME = 150000;
    private static final Logger log = LoggerFactory.getLogger(Truyenfull_ScrapingService.class);

    public String getWithRetry(URI uri) throws IOException, InterruptedException {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            attempt++;
            try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
                HttpGet request = new HttpGet(uri);
                log.info("httpclientRetry - request: {}", String.valueOf(request));
                try (CloseableHttpResponse response = httpClient.execute(request)) {
                    log.info("httpclientRetry - response: {}", response);
                    int statusCode = response.getStatusLine().getStatusCode();
                    if (statusCode >= 200 && statusCode < 300) {
                        HttpEntity entity = response.getEntity();
                        return entity != null ? EntityUtils.toString(entity) : null;
                    } else {
                        throw new HttpResponseException(statusCode, "HTTP error fetching URL. Status=" + statusCode);
                    }
                }
            } catch (HttpResponseException e) {
                if (attempt >= MAX_RETRIES) {
                    throw new IOException("Max retries reached");
                }
                System.err.println("Attempt " + attempt + " failed with status " + e.getStatusCode() + ". Retrying in " + DELAY_TIME + " ms...");
            }
            TimeUnit.MILLISECONDS.sleep(DELAY_TIME); // Exponential backoff
        }
        throw new IOException("Max retries reached");
    }
}
