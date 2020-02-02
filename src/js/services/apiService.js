import axios from 'axios';
import config from "../config/apiConfig";

/**
 *  /countries    - array of countries
 *  /cities       - array of cities
 *  /prices/cheap - array
 */
class Api {
  constructor(config) {
    this.url = config.url;
  }

  async countries() {
    try {
      const response = await axios.get(`${this.url}/countries`);
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async cities() {
    try {
      const response = await axios.get(`${this.url}/cities`);
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async prices(params) {
    // console.log(params);
    try {
      const response = await axios.get(`${this.url}/prices/cheap`, {
        params,
      });
      // console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  async airlines(params) {
    // console.log(params);
    try {
      const response = await axios.get(`${this.url}/airlines`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

}

const api = new Api(config);

export default api;
