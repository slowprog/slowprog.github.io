---
layout: post
title: Бекап в Dropbox на Linux (Debian/Ubuntu)
date: 2013-07-05T00:24:00+03:00
categories: Администрирование
tags: [ubuntu, debian, backup]
---

Рано или поздно все сталкиваются с теми или иными проблема требующими для своего решения наличие бэкапа. Это может быть случайное удаление или изменение какого-либо важного файла, запуск команды `rm -rf /` от рута (каламбурчик) или что-либо другое. А если у вас ещё не было форс-мажора, и вы думаете, что ваши руки достаточно прямые, чтобы с сервером никогда ничего не случалось, то будьте уверены, что это не так. Если не вы, то кто-то другой этому поспособствует. А бэкап всегда должен быть в надёжном месте и как можно свежее. Именно этим мы сегодня и займёмся: создадим резервную копию данных с сервера под управлением Debian.

Вообще, в больших проектах всё устроенно относительно сложно, в силу сложности самого проекта и его сопровождения, могут бэкапиться целый ряд серверов и рабочих станций. Нам же нужно забэкапить всего один сервер, при этом, необходимо соблюсти следующие требования:

* Всё поднималось быстро и просто.
* Все данные хранились независимо от самого сервера.
* Данные были всегда актуальны и свежи.
* Процесс резервирования происходил автоматически.
* Всё это было бесплатно.

Делается это легко и просто. Для этого мы используем следующие ресурсы:

* backup-manager — отличный опенсорсный набор bash-скриптов, позволяющих архивировать любые папки, в том числе и создавать инкрементальные архивы, делать резервное копирование баз данных MySQL, делать резервное копирование svn-репозиториев и многое другое.
* Dropbox — облачный сервис для хранения и синхронизации данных, в нашем случае, для хранения резервных копий.

Алгоритм работы резервного копирования будет следующий: backup-manager запускается по cron’у и создает инкрементные бэкапы указанных файлов и баз MySQL, архивирует их и кладёт в определенную директорию, далее демон dropbox’а их забирает на облачный сервис. Звучит не так сложно. Посмотрим поподробнее.

## Установка Dropbox в Debian

Dropbox — это облачный сервис для хранения данных, при этом бесплатно позволяет использовать 2Гб, чего нам будет достаточно. Для начала необходимо [зарегистрироваться на dropbox](https://db.tt/qLSZzmKDJ2).

Далее установим демон dropbox на сервер. Для этого всё сделаем по-модному: добавим новый репозиторий. Посмотреть какие есть репозитории Dropbox можно [в их хелпе](https://www.dropbox.com/en/help/desktop-web/linux-repository?_locale_specific=en). Поскольку у нас Debian, то мы добавляем следующую строку в */etc/apt/sources.list*:

```shell
$ deb http://linux.dropbox.com/debian squeeze main
```

Далее импортируем GPG ключи в свой репозитории следующей командой:

```shell
$ apt-key adv --keyserver pgp.mit.edu --recv-keys 5044912E
```

Обновляем свой репозиторий:

```shell
$ apt-get update
```

И установим Dropbox:

```shell
$ apt-get install dropbox
```

Далее надо выкачать сам демон Dropbox и получит специальную ссылку для того, чтобы дать доступ вашему серверу к аккаунту Dropbox. Вначале вызовем следующую команду:

```shell
$ dropbox start -i
```

Эта команда выкачает в корень файловой системы файлы Dropbox (*.dropbox* и *.dropbox-dist*). Теперь можете запускать демон:

```shell
$ dropbox start
To link this computer to a dropbox account, visit the following url:
https://www.dropbox.com/cli_link?host_id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Демон вам выдаст ссылку, по которой вы сможете привязать ваш сервер к аккаунту. Вставьте ссылку в браузер, перейдите по ней и введите там свой пароль от аккаунта Dropbox. После этого вы можете посмотреть [тут](https://www.dropbox.com/account), что ваш сервер имеет доступ к аккаунту. После перезапустите dropbox и всё должно работать:

```shell
$ dropbox stop
$ dropbox start
```

После запуска, в корне файловой системы будет создана папка Dropbox (с заглавной буквы) — это и будет корнем вашего облачного сервиса, который будет синхронизироваться. Что бы вы туда не поместили, всё окажется на облачном сервисе. Теперь нам надо, чтобы backup-manager в эту папку сбрасывал бэкапы, а точнее пусть он скидывает в *Dropbox/backup/*, а для этого вначале создайте её:

```shell
$ mkdir Dropbox/backup/
```

## Установка и настройка backup-manager

Установка и настройка backup-manager довольно элементарна. Тем более, что собирать ничего из исходников не нужно и пакет есть в репозитории:

```shell
$ apt-get install backup-manager
```

Во время установки вам будут задавать вопросы. Вы можете на них сразу ответить, а можете потом всё в конфиге подправить. Тут я приведу лучше просто работу с конфигом. Т.е. если не знаете что отвечать, то просто энтер жмякайте и идите дальше.

Как завершится установка откройте конфиг:

```shell
$ nano /etc/backup-manager.conf
```

Там много всего интересного, но я расскажу только о тех настройках, что нам понадобятся в рамках этого мануала (более подробно почти полностью переведенный на русский конфиг смотрите [тут](http://openwiki.ru/wiki/Backup_Manager:пример_файла_конфигурации):

* Директория хранения бэкапов:
  ```shell
  export BM_REPOSITORY_ROOT="Dropbox/backup/"
  ```

* Владелец файлов и права доступа:
  ```shell
  export BM_REPOSITORY_USER="root"
  export BM_REPOSITORY_GROUP="root"
  export BM_REPOSITORY_CHMOD="770"
  ```

* Используемые методы резервного копирования (инкрементальный бэкап файлов и бэкап баз MySQL):
  ```shell
  export BM_ARCHIVE_METHOD="tarball-incremental mysql"
  ```

* Используемый тип архивов (tar.gz):
  ```shell
  export BM_TARBALL_FILETYPE="tar.gz"
  ```

* При архивировании backup-manager проходит по символическим ссылкам (false):
  ```shell
  export BM_TARBALL_DUMPSYMLINKS="false"
  ```

* Директории, что будут бэкапится:
  ```shell
  export BM_TARBALL_DIRECTORIES="/etc /home"
  ```

* Если необходимо, то указать исключения (это не будет бэкапится):
  ```shell
  export BM_TARBALL_BLACKLIST="/home/blacklist"
  ```

* Расписание резервного копирования. Полная копия будет создаваться еженедельно, а инкрементальные бэкапы — ежедневно:
  ```shell
  export BM_TARBALLINC_MASTERDATETYPE="weekly"
  export BM_TARBALLINC_MASTERDATEVALUE="1"
  ```

* Указываем необходимые для резервирования базы данных MySQL (по дефолту стоит __ALL__, что значит резервировать все базы):
  ```shell
  export BM_MYSQL_DATABASES="__ALL__"
  ```

* Данные для подключения к MySQL:
  ```shell
  export BM_MYSQL_ADMINLOGIN="user"
  export BM_MYSQL_ADMINPASS="pass"
  export BM_MYSQL_HOST="localhost"
  export BM_MYSQL_PORT="3306"
  ```

* Метод сжатия дампов баз данных:
  ```shell
  export BM_MYSQL_FILETYPE="bzip2"
  ```

После конфигурации можно проверить работу резервного копирования. Для этого нужно его просто запустить:

```shell
$ backup-manager
```

Если все отлично отработало и в указанной директории появились нужные бэкапы, то просто добавляем запуск резервирования в cron:

```shell
$ crontab -e
```

Пусть она запускется каждый день в полночь:

```shell
0 0 * * * /usr/sbin/backup-manager > /dev/null 2>> /var/log/backup-manager.log
```

В случае если будут какие-то проблемы, то смотрите указанный лог.

## Послесловие

Всё бы хорошо, но как вы заметили, всё работает от рута и расшаренная директория Dropbox находится в корне файловой системы. По меньшей мере, это некрасиво, особенно последнее. Я честно пытался избежать этих некрасивых моментов, но у меня не получилось.

Во-первых, я пытался заставить работать Dropbox из под другого пользователя, в его домашней директории. Это довольно просто и у меня это получилось. Получилось, что коневя директория Dropbox находилась в */home/username/Dropbox*. Вроде всё хорошо, но я наткнулся на странное поведение backup-manager. Чтобы Dropbox мог забрать файлы к вам в аккаунт, он должен иметь права на их чтение, для этого в конфиге backup-manager есть переменные *BM_REPOSITORY_USER* и *BM_REPOSITORY_GROUP* — юзер и группа, которым будут принадлежать эти созданные бэкапы. Но когда создаётся бэкап, то там помимо архивов с мастер-бэкапом есть и инкрементальные бэкапы, которые имеют расширение *.bin*. И вот у этих инкрементальных бэкапов владелец был root, а права на всё про всё даны только владельцу. Т.е. Dropbox не мог с собой утянуть файлы *.bin* т.к. прав его пользователю явно не хватало, что меня крайне расстроило.

Во-вторых, можно было бы всё оставить и под рутом, если бы сменить корневую папку для Dropbox, чтобы она не находилась в корне файловой системы. Но оказалось, что поменять дефолтовую директорию Dropbox не так-то просто. А точнее для данной версии (последняя на этот момент была 2.0.8) под Linux невозможно. Для ранних версий это можно было сделать путём добавления в базу данных (на SQLite) Dropbox нужную переменную. Притом для разных версий это делается немного по разному. [Вот wiki](http://www.dropboxwiki.com:80/tips-and-tricks/install-dropbox-in-an-entirely-text-based-linux-environment) Dropbox (в конце пункта Changing the dropbox folder location) сказано:

> Note that the script above currently only works for Dropbox 0.7.x and not 1.0.x — for Dropbox 1.0 you can use this PHP script or this Python script.

Т.е. про вторую версию никаких скриптов. Но меня это не остановило. Я попытался пошаманить, добавил в базу данных нужную переменную с нужным значение, но и это не сработало. Похоже это зашито где-то в исходниках. И при этом под Linux для Dropbox даже написан специальный [CLI-сценарий](https://linux.dropbox.com/packages/dropbox.py) на Питоне, с помощью которого им можно легко и просто управлять, но там нет функции смены дефолтовой директории. Странно.

В общем, я потерялся немного. И связку backup-manager и Dropbox настроил для работы полностью из под рута. Для небольшого сервера, для которого я это делал, этого достаточно и ничего критичного в этом нет. Но всё же нехороший осадок остался.

Если вы вдруг знаете как обойти или решить эти проблемы, то сообщите, пожалуйста, в комментариях. Возможно я чего-то упустил или чего-то не понимаю. И скорее всего это именно так! В общем, если можете, то наставьте меня на путь истинный.

На этому у меня всё. Не забывайте бэкапить самые важные и не очень важные файлы на своих серверах, никогда не знаешь, что может пригодиться.
