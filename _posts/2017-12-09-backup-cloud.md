---
layout: post
title: Резервное копирование в облако
date: 2017-12-09T05:00:00+03:00
categories: Администрирование
tags: [ubuntu, debian, backup, duplicity, selectel, amazon]
---

В продолжение старой темы про [резервное копирование](/secure-backup) решил накидать про то как отправлять бекапы в облако быстро и весело.

В моём случае бакапы будут отправляться в [Selectel](https://selectel.ru/?ref_code=fde9813663) (надо в России, чтобы всё хостилось, ну, вы знаете), но по большому счёту от других стореждей отличаться будут только реквизиты авторизации по swift-протоколу.

Сценарий не сложный: сборка инкрементальных бекапов будет делаться с помощью [duplicity](http://duplicity.nongnu.org), который по swift будет отправлять сгенерированные бекапы в облачное хранилище Selectel. Основная тут сложность в отправке, нужен клиент для работы со swift.

## Установка swift-клиента на Ubuntu 14 и 16

В несколько шагов устанавливаем клиента:

1. Сперва, сразу добавляем в переменные окружения реквизиты необходимые для работы с сервисом через swift (пароль и пользователя необходимо взять из аккаунта Selectel):

    ```shell
    # ~/.bash_profile
    export SWIFT_USERNAME="some_user"
    export SWIFT_PASSWORD="some_pass"
    export SWIFT_AUTHURL="https://auth.selcdn.ru"
    export SWIFT_AUTHVERSION="1"
    ```

    Не забудем сразу это подхватить:

    ```shell
    $ source ~/.bash_profile
    ```

    Кстати, в этот момент лучше уже создать специальный контейнер в Selectel для бекапов. Ниже он понадобится, в данном случае он называется *backups*.

2. Обновляемся и устанавливаем необходимые пакеты из репы:

    ```shell
    $ apt-get update
    $ apt-get install python-pip gnupg2 python-paramiko python-pycryptopp python-boto python-dev librsync-dev python-lockfile libffi-dev libssl-dev
    ```

3. Устанавливаем непосредственно питоновский swift-клиент версию 2.2 т.к. была странная бага при первой установке: подозрительное поведение похожее на невозможность авторизации доп. пользователя в Selectel. В 2.2 всё нормально работает (хотя уже есть версия 3), а написано это [тут](https://ask.openstack.org/en/question/52280/non-admin-unable-to-upload-with-python-swiftclient/) (не совсем это, но почти).

    ```shell
    $ pip install --upgrade pip
    $ pip install -Iv python-swiftclient==2.2 python-keystoneclient==2.2
    ```

    Если установка прошла хорошо, то можно сразу перейти к следующему пункту.

    В процессе множества попыток установить первый раз была бага при установке *python-keystoneclient*. Из кеша pip подтягивал не то что надо (что в первый раз пытались установить, а не в текущий, не смотря на указанную версию) и потому всё крешелось (как ниже обозначена ошибка). Выход нашёл [тут](https://bugs.launchpad.net/python-keystoneclient/+bug/1547698).

    ```shell
    Command python setup.py egg_info failed with error code 1 in /tmp/pip_build_root/positional
    Storing debug log for failure in /root/.pip/pip.log
    ```

4. Необходимо кое-что доставить для python:

    ```shell
    $ pip install --upgrade --force requests[security]
    # или если zsh
    # pip install --upgrade --force requests\[security\]
    ```

    На Ubuntu 16 пришлось ещё кое-что доставить ([тут](https://stackoverflow.com/questions/29134512/insecureplatformwarning-a-true-sslcontext-object-is-not-available-this-prevent) про это):

    ```shell
    $ pip install --force pyOpenSSL ndg-httpsclient pyasn1
    ```

## Установка duplicity и бекап

Для того чтобы начать бекапить в облако надо собрать и настроить duplicity:

1. Собираем свежий duplicity (взято с [DO](https://www.digitalocean.com/community/tutorials/how-to-use-duplicity-with-gpg-to-securely-automate-backups-on-ubuntu)). Релизы duplicity можно посмотреть по [этому FTP](http://ftp.acc.umu.se/mirror/gnu.org/savannah//duplicity/).

    ```shell
    $ cd /root
    $ wget http://ftp.acc.umu.se/mirror/gnu.org/savannah//duplicity/duplicity-0.7.10.tar.gz
    $ tar xzvf duplicity*
    $ cd duplicity*
    $ python setup.py install
    $ cd ..
    $ rm -rf duplicity*
    ```

2. Создаём необходимые директории для складывания бекапов, логов и конфига.

    ```shell
    $ mkdir -p /var/backups/dump/mysql/
    $ mkdir /var/backups/dump/mongodb/
    $ mkdir /var/log/duplicity/
    ```

3. Устанавливаем маленький скрипт [duplicity-backup.sh](https://github.com/zertrin/duplicity-backup.sh) позволяющий все параметры для duplicity держать в виде удобного конфига:

    ```shell
    $ cd /opt
    $ git clone --branch v1.3.0 https://github.com/zertrin/duplicity-backup.sh.git duplicity-backup
    ```

    Делаем файл исполняемым:

    ```shell
    $ chmod +x /opt/duplicity-backup/duplicity-backup.sh
    ```

    Создаём конфиг, где указано какие директории бекапить, куда отправлять (в директорию по названию сервера) и др. Более подробно про конфиг можно поглядеть в примере */opt/duplicity-backup/duplicity-backup.conf.example*. А тут приведён его короткий вариант (без комментариев) без шифрования и подписи бекапов:

    ```bash
    # /opt/duplicity-backup/duplicity-backup.conf
    #!/bin/bash
    ENCRYPTION="no"
    ROOT="/"
    # HOSTNAME=$(hostname -f)
    DEST="swift://backups/${HOSTNAME}"
    INCLIST=("/opt" "/root" "/etc" "/var" "/srv" "/home")
    STATIC_OPTIONS="--full-if-older-than 1M"
    CLEAN_UP_TYPE="remove-all-but-n-full"
    CLEAN_UP_VARIABLE="2"
    LOGDIR="/var/log/duplicity/"
    LOG_FILE="duplicity-`date +%Y-%m-%d_%H-%M`.log"
    LOG_FILE_OWNER="root:root"
    VERBOSITY="-v3"

    #EMAIL_TO=
    #EMAIL_FROM=
    #EMAIL_SUBJECT=
    #EMAIL_FAILURE_ONLY="yes" # send e-mail only if there was an error while creating backup
    #MAIL="mailx"     # default command for Linux mail

    # Possible values for NOTIFICATION_SERVICE are: slack, pushover, ifttt
    NOTIFICATION_SERVICE="slack"
    NOTIFICATION_FAILURE_ONLY="yes" # send notifications only if there was an error while creating backup

    # Provider: Slack
    SLACK_HOOK_URL="https://hooks.slack.com/services/xxxxxxxxx/xxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx"
    SLACK_CHANNEL="#error"
    SLACK_USERNAME="duplicity-backup"
    SLACK_EMOJI="package"
    ```

    Внимание! При копировании конфига могут была странная ошибка с *INCLIST*, там добавлялся скрытый символ, или что-то вроде того, и в конечном итоге при бекапе в *du* попадала строка с пробелом в начале и всё крешелось. Просто на всякий случай предупреждаю т.к. сам столкнулся.

    По конфигу не должно быть особых сложностей. Обращаю только внимание, что в параметре *DEST* собственно и указан наш контейнер из Selectel, к которому идёт обращение по протоколу swift по реквизитам, которые мы указали в переменных окружения.

    Кстати, прошу заметить, что в конце конфига есть оповещения в Slack, если произошла ошибка во время бекапа. Очень полезно.

7. И про ротацию логов не забываем. Т.к. при каждом запуске создаётся отдельный файл-лог, то надо бы всё это ротировать, а то так в скором времени толпы файлов будут. Добавляем новый конфиг */etc/logrotate.d/duplicity*:

    ```
    /var/log/duplicity/*.log {
        daily
        missingok
        rotate 30
        compress
        delaycompress
        copytruncate
        notifempty
    }
    ```

8. Устанавливаем в *crontab* команду, которая собирает и отправляет необходимые файлы. Но обратите внимание, что всегда перед запуском *duplicity* подтягивается *.bash_profile*, в противном случае окружение в крон само не пробрасывается.

    Тут я привёл примеры команд для бекапа разных штук:

    * MySQL (базы храняться 14 дней, вместо USER и PASS свои доступы):

        ```shell
        0 2 * * * /bin/mkdir -p /var/backups/dump/mysql/ && /usr/bin/find /var/backups/dump/mysql/ -mtime +14 -delete && /usr/bin/mysqldump --single-transaction --routines --events --triggers --add-drop-table --extended-insert -uUSER -h127.0.0.1 -pPASS -A | gzip -9 > /var/backups/dump/mysql/$(date + '\%d-\%m-\%y').sql && . $HOME/.bash_profile ; /opt/duplicity-backup/duplicity-backup.sh -c /opt/duplicity-backup/duplicity-backup.conf --backup
        ```

    * MongoDB (базы храняться 14 дней):

        ```shell
        0 2 * * * /bin/mkdir -p /var/backups/dump/mongodb/ && /usr/bin/find /var/backups/dump/mongodb/ -mtime +14 -delete && /usr/bin/mongodump -o /var/backups/dump/mongodb/$(date +'\%d-\%m-\%y') && . $HOME/.bash_profile ; /opt/duplicity-backup/duplicity-backup.sh -c /opt/duplicity-backup/duplicity-backup.conf --backup
        ```

    * GitLab:

        ```shell
        0 2 * * * /usr/bin/gitlab-rake gitlab:backup:create && . $HOME/.bash_profile ; /opt/duplicity-backup/duplicity-backup.sh -c /opt/duplicity-backup/duplicity-backup.conf --backup
        ```

    После этого каждый день в 2а часа ночи будет создаваться бека указанных в конфиге директорий. Для проверки желательно сразу запустить команду.

## Устранение проблем

Если потребуется удалить duplicity, то можно это устроить. Поскольку это python, то [по'python'овски и удалять](https://stackoverflow.com/questions/1550226/python-setup-py-uninstall/1550235#1550235), находим все установленные файлы во время установки и удаляем их:

```shell
$ python setup.py install --record files.txt
$ cat files.txt | xargs rm -rf
```

На этом мне больше сказать нечего. Удачи!
