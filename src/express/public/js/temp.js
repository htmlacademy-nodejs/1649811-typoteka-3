'use strict';

const btnNewArticle = document.querySelector(`.header__button-new`);
btnNewArticle.addEventListener(`click`, () => {
  window.location = `/articles/add`;
});

const btnCloseForm = document.querySelector(`.button--popup-close`);
if (btnCloseForm) {
  btnCloseForm.addEventListener(`click`, () => {
    window.location = `/my`;
  });
}
