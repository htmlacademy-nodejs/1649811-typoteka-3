'use strict';

const RegisterMessage = {
  USER_ALREADY_REGISTER: `Пользователь с таким email уже зарегистрирован`,
  WRONG_EMAIL: `Некорректный email`,
  REQUIRED_FIELD: `обязательно для заполнения`,
  MIN_PASSWORD_LENGTH: `Пароль должен быть не меньше 6 символов`,
  MAX_PASSWORD_LENGTH: `Пароль должен быть не больше 20 символов`,
  PASSWORDS_NOT_EQUALS: `Пароли не совпадают`,
  EMPTY_VALUE: `не указано значение`,
  ALPHA_VALUE: `может содержать только буквы`,
};

const LoginMessage = {
  USER_NOT_EXISTS: `Пользователь с таким email не зарегистрирован`,
  WRONG_PASSWORD: `Неправильно введён логин или пароль`,
  WRONG_EMAIL: `Неправильный email`,
  REQUIRED_FIELD: `Поле обязательно для заполнения`,
};

module.exports = {
  RegisterMessage,
  LoginMessage,
};
