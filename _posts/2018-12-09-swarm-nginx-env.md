---
layout: post
title: Генерация перменных окружения для nginx в Docker Swarm Mode
date: '2018-12-09 06:00:00 +0300'
categories: Мастерская
tags: [nginx, docker, swarm, env]
---

Есть потребность пробрасывать в location в nginx-конфиг перменные окружения. Всё потому что сам nginx их явно не видит, если его мордой не ткнуть и не прописать в location `fastcgi_param SOME_VAR some_value;`. Это норма. Но есть проблема: конфиг хранится в репозитории (может быть даже в публичном) и прописывать сами значения в конфиг ненормально. Вдруг *some_value* это токен для авторизации в каком-нибудь API!

В рабоче-крестьяноском Docker всё просто: используй [jwilder/docker-gen](https://github.com/jwilder/docker-gen). Это шаблонизатор для nginx-конфигов, который будет запускаться при перезапуске контейнеров и соответственно менять конфиг, если что. Там можно генерировать всё что угодно т.к. используется стандартный [golang-шаблонизатор](https://golang.org/pkg/text/template/). Но он работает в паре с [jwilder/nginx-proxy](https://github.com/jwilder/nginx-proxy), а у них там проблема с [Docker Swarm](https://github.com/jwilder/nginx-proxy/issues/520), вроде бы всё ещё (по крайней мере когда мне нужно было оно не работало). 

Обычно [рекомендуют использовать `envsubst`](https://serverfault.com/a/755541) для того, чтобы делать псевдо-шаблонизацию для nginx. Это хороший выход, но мне хочется немного больше универсальности. В частности, хочется иметь один образ, при запуске которого можно как-то задавать перменные в зависимости от проекта.

Эта проблема решилась отличным костылём. Я в своих проектах обычно имею файл *.env* или *.env.dist*, где есть как минимум имена перменных окружения, которые используются в проекте. Идея костыля в том, чтобы парсить этот файл при запуске контейнера и формировать подключаемый файл с перменными для nginx-конфига. Например, в конфиге будет подключаться файл *fastcgi_params_env*, как в примере ниже (лишнее выпущено):

```conf
server {
    # ...

    location ~ \.php$ {
        # ...

        include fastcgi_params_env;
    }
}
```

А образ с nginx запускается через свой entrypoint следующего вида:

```bash
cat /srv/app/.env.dist \
    | sed -e 's/\s*#.*$//' -e '/^\s*$/d' \
    | awk -F "=" '{print $1}' \
    | awk '{$1=$1};1' \
    | sed "s/\(.*\)/fastcgi_param \1 '\${\1}';/g" \
    | envsubst \
    | envsubst \
    > /etc/nginx/fastcgi_params_env

/usr/sbin/nginx -g "daemon off; error_log /dev/stderr error;"
```

Костыль по-своему прекрасен. Как не сложно догадаться, основное тут в первой команде, а вторая просто запускает nginx. Разберём построчно первую команду:

1. Читаем файл с перменными окружения. На самом деле, всё что нам там нужно это названия переменных, которые мы потом будет искать в окружении.

2. Удаляем все комментарии и пустые строки.

3. Разбиваем каждую строку по "=" и берёт только левую часть.

4. Делаем trim каждой строке, на всякий случай.

5. Формируем *fastcgi_params* для вставки перменных. Получается что-то вроде `fastcgi_param SOME_VAR ${SOME_VAR};`

6. Запускаем `envsubst`, чтобы подменить все плейхолдеры на настоящие значения из окружения уже работающего контейнера.

7. Повторно запускаем `envsubst` т.к. в значениях переменных могут быть ссылки на другие переменные, например, `SOME_VAR=${ANOTHER_VAR}`.

8. Забарсываем результат в файл, который собственно и подключается в nginx-конфиге.

Вот так. Если требуется только прокинуть переменные окружения и не нужна хитрая шаблонизация, то это неплохой выход.