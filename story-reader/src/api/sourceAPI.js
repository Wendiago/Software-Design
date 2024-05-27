import customAxios from "./customAPI";

class sourceAPI {
    async getAllSources() {
        try {
          const response = await customAxios.get(`/sources`);
          return response.data;
        } catch (error) {
          return error.response;
        }
    }
}

export default new sourceAPI();