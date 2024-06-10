import customAxios from './customAPI';

class DownloadAPI {
  async getAllSupportedFileFormats() {
    const response = await customAxios.get('/supportedFormats');
    return response.data;
  }

  async downloadNovel({ title, source, fileFormat }) {
    if (!title) {throw new Error('No title specified 💥');}
    if (!source)
    {throw new Error('No source provided or currently available 💥');}
    if (!fileFormat)
    {throw new Error('No file format provided or currently available 💥');}

    const response = await customAxios.post(
      `/${title}/download`,
      {
        'sources': source, 
        'file_format': fileFormat
      },
      { responseType: 'arraybuffer' }
    );
    return response.data;
  }
}

export default new DownloadAPI();
