import customAxios from "./customAPI";

class downloadAPI {
  async getAllSupportedFileFormats() {
    const response = await customAxios.get(`/supportedFormats`);
    return response.data;
  }

  async downloadNovel({ title, source, file_format }) {
    if (!title) throw new Error("No title specified 💥");
    if (!source)
      throw new Error("No source provided or currently available 💥");
    if (!file_format)
        throw new Error("No file format provided or currently available 💥");

    const response = await customAxios.post(
      `/${title}/download`,
      {
        "sources": source, 
        "file_format": file_format
      },
      { responseType: 'arraybuffer' }
    );
    return response.data;
  }
}

export default new downloadAPI();
