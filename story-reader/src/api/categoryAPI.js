import customAxios from "./customAPI";

class categoryAPI {
    async getAllCategories({ source }) {
        try {
          console.log(source)
          const response = await customAxios.post(`/categories`, source);
          return response.data;
        } catch (error) {
          return error.response;
        }
    }

    async getNovelByCategory({category, pageNumber = 1, source}) {
        try {
          const response = await customAxios.post(`/category/${category}?page=${pageNumber}`, source);
          return response.data;
        } catch (error) {
          return error.response;
        }
    }
}

export default new categoryAPI();