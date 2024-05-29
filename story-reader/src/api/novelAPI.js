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

  async getNovelChapter({ title, chapterNumber, source}) {
    try {
      console.log(chapterNumber)
      const response = await customAxios.post(`/${title}/${chapterNumber}`, source);
      console.log(`/${title}/${chapterNumber}`, source)
      return response.data;
    } catch (error) {
      return error.response;
    }
  }
}

export default new novelAPI();