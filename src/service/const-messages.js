'use strict';

const RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован.`,
  WRONG_EMAIL: `Некорректный email.`,
  REQUIRED_FIELD: `обязательно для заполнения.`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов.`,
  MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 20 символов.`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают.`,
  EMPTY_VALUE: `не указано значение.`,
  ALPHA_VALUE: `может содержать только буквы.`,
};

const LoginMessage = {
  USER_NOT_EXISTS: `Пользователь с таким email не зарегистрирован.`,
  // WRONG_PASSWORD: `Неправильно введён логин или пароль`,
  WRONG_PASSWORD: `Неверный пароль.`,
  WRONG_EMAIL: `Неправильный email.`,
  REQUIRED_FIELD: `Поле обязательно для заполнения.`,
};

const ArticleMessage = {
  REQUIRED_FIELD: `Поле обязательно для заполнения.`,
  MIN_TITLE_LENGTH: `Заголовок должен быть не менее 30 символов.`,
  MAX_TITLE_LENGTH: `Заголовок должен быть не более 250 символов.`,
  MIN_ANNOUNCE_LENGTH: `Анонс должен быть не менее 30 символов.`,
  MAX_ANNOUNCE_LENGTH: `Анонс должен быть не менее 250 символов.`,
  MAX_TEXT_LENGTH: `Максимальная длина текста 1000 символов.`,
  EMPTY_CATEGORY: `Не выбрана категория, выберите как минимум одну.`,
  IMAGE_FORMAT: `Допустимый формат изображения JPEG(JPG) или PNG.`,
  MAX_IMAGE_LENGTH: `Максимальная длина названия файла изображения 255 символов.`,
  WRONG_DATE_FORMAT: `Неверный формат даты.`,
};

const CommentMessage = {
  MIX_TEXT_LENGTH: `Минимальная длина текста 20 символов.`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
};

const CategoryMessage = {
  MIX_TEXT_TITLE: `Название категории должно содержать не менее 5 символов.`,
  MAX_TEXT_TITLE: `Название категории должно содержать не более 30 символов.`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
};


module.exports = {
  RegisterMessage,
  LoginMessage,
  ArticleMessage,
  CommentMessage,
  CategoryMessage,
};
