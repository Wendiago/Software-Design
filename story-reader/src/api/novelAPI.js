import customAxios from "./customAPI";

class novelAPI {
  async getNovelDetail({ title, source }) {
      try {
        const response = await customAxios.post(`/${title}`, source);
        return response.data;
      } catch (error) {
        return error.response;
      }
  }

  async getNovelChapterList({ title, pageNumber, source}) {
      try {
        const response = await customAxios.post(`/${title}/chapter-list?page=${pageNumber}`, source);
        return response.data;
      } catch (error) {
        return error.response;
      }
  }

  async getNovelChapterContent({ title, chapterNumber, source}) {
    try {
      const response = await customAxios.post(`/${title}/${chapterNumber}`, source);
      return response.data;
    } catch (error) {
      return error.response;
    }
  }

  async searchNovel({ keyword, pageNumber, source}) {
    try {
      const response = await customAxios.post(`/search?keyword=${keyword}&page=${pageNumber}`, source);
      return response.data;
    } catch (error) {
      return error.response;
    }
  } 
}

export default new novelAPI();