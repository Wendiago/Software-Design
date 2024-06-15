import customAxios from './customAPI';

class SourceAPI {
  async getAllSources() {
    const response = await customAxios.get('/sources');
    return response.data;
  }
}

export default new SourceAPI();
