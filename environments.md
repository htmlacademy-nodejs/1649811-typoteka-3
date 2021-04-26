### Подключение к СУБД

`DATABASE_URI - dialect://user:pass@host:port/dbname`

#####
Пример

`DATABASE_URI=postgres://webmaster:webpass@example.com:5432/mydatabase`

###
### Секретные ключи
#### ключ session

`SECRET_SESSION=***************************`

#### ключ cookie

`SECRET_COOKIE=***************************`

#### ключ jwt access

`JWT_ACCESS_SECRET=***************************`

#### ключ jwt refresh

`JWT_REFRESH_SECRET=***************************`

###
### Параметры серверов

####  Сервер API
`API_HOST=http://localhost`
`API_PORT=3000`

#### Сервер приложения
`FRONT_PORT=8080`

###
#### Данные администратора
`ADMIN_FIRSTNAME=admin`
`ADMIN_LASTNAME=admin`
`ADMIN_EMAIL=admin@mai.com`
`ADMIN_PASSWORD=admin`
`ADMIN_AVATAR=avatar-5.png`
