import customAxios from "./customAPI";

class novelAPI {
  async getNovelDetail({ title, source }) {
    if (!source)
      throw new Error("No source provided or currently available 💥");
    const response = await customAxios.post(`/${title}`, source);
    return response.data;
  }

  async getNovelChapterList({ title, pageNumber, source }) {
    console.log(`/${title}/chapter-list?page=${pageNumber}`)
    if (!title) throw new Error("No title specified 💥");
    if (!pageNumber) throw new Error("No page specified 💥");
    if (!source)
      throw new Error("No source provided or currently available 💥");

    const response = await customAxios.post(
      `/${title}/chapter-list?page=${pageNumber}`,
      source
    );
    return response.data;
  }

  async getNovelChapterContent({ title, chapterNumber, source }) {
    if (!title) throw new Error("No title specified 💥");
    if (!chapterNumber) throw new Error("No chapter number specified 💥");
    if (!source)
      throw new Error("No source provided or currently available 💥");

    const response = await customAxios.post(
      `/${title}/${chapterNumber}`,
      source
    );
    return response.data;
  }

  async searchNovel({ keyword, pageNumber = 1, source }) {
    if (!keyword) throw new Error("No keyword specified 💥");
    if (!source)
      throw new Error("No source provided or currently available 💥");

    const response = await customAxios.post(
      `/search?keyword=${keyword}&page=${pageNumber}`,
      source
    );
    return response.data;
  }
}

export default new novelAPI();
