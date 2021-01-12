'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    return this._articles.filter((offer) =>
      offer.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

module.exports = SearchService;
