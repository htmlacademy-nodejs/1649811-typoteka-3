'use strict';

const axios = require(`axios`);
const {API_PREFIX} = require(`./const`);
const {API_PORT, API_HOST} = process.env;
const TIMEOUT = 1000;


const defaultURL = `${API_HOST}:${API_PORT}${API_PREFIX}`;


class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout,
    });
  }

  async getArticles({limit, offset, comments} = {}) {
    return this._load(`/articles`, {params: {limit, offset, comments}});
  }

  async getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  async getComments(accessToken) {
    return this._load(`/articles/comments`, {
      headers: {'Authorization': `Bearer: ${accessToken}`},
    });
  }

  async getPreviews(limit, offset, categoryId = null) {
    return this._load(`/articles/previews`, {params: {limit, offset, categoryId}});
  }

  async getMostPopular() {
    return this._load(`/articles/most-popular`);
  }

  async getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  async getCategories(all = null) {
    return this._load(`/categories`, {params: {all}});
  }

  async getArticleCategories(articleId) {
    return this._load(`/categories/by-article`, {params: {articleId}});
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async createArticle(data, accessToken) {
    return this._load(`/articles`, {
      method: `POST`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });
  }

  async editArticle(id, data, accessToken) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });
  }

  async deleteArticle(id, accessToken) {
    return this._load(`/articles/${id}`, {
      method: `DELETE`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
    });
  }

  async createComment(id, data, accessToken) {
    return this._load(`/articles/${id}/comments`, {
      method: `POST`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });
  }

  async deleteComment(id, accessToken) {
    return this._load(`/articles/comments/${id}`, {
      method: `DELETE`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
    });
  }

  async createCategory(data, accessToken) {
    return this._load(`/categories`, {
      method: `POST`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });
  }

  async updateCategory(id, data, accessToken) {
    return this._load(`/categories/${id}`, {
      method: `PUT`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
    });
  }

  async deleteCategory(id, accessToken) {
    return this._load(`/categories/${id}`, {
      method: `DELETE`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
    });
  }

  async createUser(data) {
    return this._load(`/user`, {
      method: `POST`,
      data,
    });
  }

  async login(data) {
    return this._load(`/login`, {
      method: `POST`,
      data,
    });
  }

  async refresh(refreshToken) {
    const data = {token: refreshToken};
    return this._load(`/refresh`, {
      method: `POST`,
      data,
    });
  }

  async logout(accessToken, refreshToken) {
    const data = {token: refreshToken};
    return this._load(`/logout`, {
      method: `DELETE`,
      headers: {'Authorization': `Bearer: ${accessToken}`},
      data,
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
