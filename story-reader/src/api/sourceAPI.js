import customAxios from "./customAPI";

class sourceAPI {
  async getAllSources() {
    const response = await customAxios.get(`/sources`);
    return response.data;

    // return error.response;
  }
}

export default new sourceAPI();
