'use strict';

const socket = io();

const hotList = document.querySelector(`.hot__list`);
const lastList = document.querySelector(`.last__list`);


const showMostPopular = (mostPopular) => {
  hotList.innerHTML = mostPopular.map((item) => (
  `<li class="hot__list-item">
      <a class="hot__list-link" href="/artilces/${item.id}">
        ${item.announce} <sup class="hot__link-sup">${item.commentsCount}</sup>
      </a>
    </li>`
  )).join(``);
}

const showLastComments = (lastComments) => {
  lastList.innerHTML = lastComments.map((item) => {
    const avatarSrc = item.userAvatar ? `/img/${item.userAvatar}` : ``;
    return `<li class=last__list-item>
        <img class="last__list-image" src=${avatarSrc} width="20" height="20" alt="avatar">
        <b class="last__list-name">${item.username}</b>
        <a class="last__list-link" href="/articles/${item.articleId}">${item.text}</a>
     </li>`}
  ).join(``);
}

socket.addEventListener(`most-popular`, async (message) => {
  const {lastComments, mostPopular} = message;

  showLastComments(lastComments);
  showMostPopular(mostPopular);
});
