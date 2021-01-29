'use strict';

const axios = require(`axios`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async getArticles(userId = null) {
    const url = userId ? `/articles?comments=true&userId=${userId}` : `/articles?comments=true`;
    return this._load(url);
  }

  async getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  async getCategoryArticles(id) {
    return this._load(`/articles/category/${id}`);
  }

  async getCategories(count) {
    return this._load(`/categories`, {params: {count}});
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data,
    });
  }

  async editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data,
    });
  }

  async deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: `DELETE`,
    });
  }

  async deleteComment(id, articleId) {
    return this._load(`/articles/${articleId}/comments/${id}`, {
      method: `DELETE`,
    });
  }

  async createCategory(data) {
    return this._load(`/categories`, {
      method: `POST`,
      data,
    });
  }

  async updateCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: `PUT`,
      data,
    });
  }

  async deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: `DELETE`,
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

module.exports = {
  API,
  getApi: () => new API(defaultURL, TIMEOUT),
};
