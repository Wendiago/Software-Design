import customAxios from './customAPI';

class CategoryAPI {
  async getAllCategories({ source }) {
    if (!source)
    {throw new Error('No source provided or currently available 💥');}

    const response = await customAxios.post('/categories', source);
    return response.data;
  }

  async getNovelByCategory({ category, pageNumber = 1, source }) {
    if (!category) {throw new Error('No category specified 💥');}
    if (!source)
    {throw new Error('No source provided or currently available 💥');}

    const response = await customAxios.post(
      `/category/${category}?page=${pageNumber}`,
      source
    );
    return response.data;
  }
}

export default new CategoryAPI();