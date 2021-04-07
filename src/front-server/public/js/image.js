'use strict';

const previewImage = document.querySelector(`.preview__image`);
const imageInput = document.getElementById(`image-input`);
const imageName = document.getElementById(`image-name`);
const imageDeleteBtn = document.getElementById(`image-remove`);

const changeImageHandler = () => {
  const [file] = imageInput.files;
  previewImage.src = window.URL.createObjectURL(file);
}

const deleteImageHandler = (evt) => {
  evt.preventDefault();

  previewImage.src = ``;
  imageInput.files = null;
  imageName.value = ``;
}

document.addEventListener(`change`, changeImageHandler);
imageDeleteBtn.addEventListener(`click`, deleteImageHandler);

