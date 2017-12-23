---
layout: post
title: Массовое обновление репозиториев GitLab
date: '2017-12-23 17:00:00 +0300'
categories: Мастерская
tags: [gitlab, bash, tools]
---

Однажды мне потребовалось сделать странное – обновить код в большом количестве репозиториев GitLab одной группы. В общем-то алгоритм довольно простой: надо подтянуть актуальные репы, произвести автозамену по проектам, закомитить и запушить. Проблема в том, что реп было очень много и ручной режим был так себе перспективной. Как мы дошли до этого – совсем другая история.

## 1. Подтягивание репозиториев

Для того, чтобы подтянуть все проекты конкретной группы (и новые и существующие уже на локальной машине) можно использовать следующий bash-скрипт:

```bash
#!/bin/bash

USERS_DIR="[path-to-projects-folder]"
DOMAIN="[gitlab-domain]"
GROUP="[gitlab-group]"
TOKEN="[gitlab-token]"
PROJECTS=""
EMPTY="[]"

for i in {1..10}
do
    URL="https://$DOMAIN/api/v3/projects?per_page=100&page=$i"
    RESPONSE=`curl --header "PRIVATE-TOKEN: $TOKEN" $URL`
    if [ "$RESPONSE" != "$EMPTY" ]; then
        TMP=`echo $RESPONSE | grep -o "\"ssh_url_to_repo\":[^ ,]\+" | grep "git@$DOMAIN:$GROUP/" | xargs -L1 basename | awk -F '.' '{print $1}'`
        PROJECTS="$PROJECTS $TMP"
    else
        break
    fi
done

while read -r PROJECT; do
      DIR="$USERS_DIR/$PROJECT"
      if [[ -d $DIR ]]; then
          echo "Yeap '$PROJECT'"
          cd $DIR && git pull
      else
          echo "Nope '$PROJECT'"
          cd $USERS_DIR && git clone git@$DOMAIN:$GROUP/$PROJECT.git
      fi
done <<< "$PROJECTS"
```

В этом скрипте нужно подставить следующие данные:

* *[path-to-projects-folder]* – путь до директории, где будут находиться проекты (или часть уже там лежит).
* *[gitlab-domain]* – домен вашего GitLab.
* *[gitlab-group]* – название группы откуда будут браться проекты.
* *[gitlab-token]* – токен для работы с API GitLab из своего аккаунта.

## 2. Автозамена

Далее, можно с помощью средств какого-нибудь IDE или редактора произвести автозамену, но я приведу пример bash-скрипта, который и будет помогать производить подмену одних строк кода в файлах на другие. Для этого можно использовать хитрую связку:

1. Установить на машину тулзу [ag](https://github.com/ggreer/the_silver_searcher). Вообще, тулза довольно полезная и в хозяйстве её иметь неплохо, с помощью неё можно быстро искать в файлах с кодом, очень быстро, по большому количеству файлов.

2. Создать скрипт *replace.sh* в директории с проектами со следующим содержимым:

    ```bash
    # ag <https://github.com/ggreer/the_silver_searcher>
    # usage: replace.sh [search] [replace]
    # caveats: will choke if either arguments contain a forward slash
    # notes: will back up changed files to *.bak files

    ag -l $1 -G $3 | xargs perl -pi -e "s/$1/$2/g"

    # or if you prefer sed's regex syntax:

    # ag -l $1 -G $3 | xargs sed -e "s/$1/$2/g"
    ```

3. C помощью команды `./replace.sh [some_string] [another_string]`, можно подменять одно на другое. Если необходимо использовать в подмене sed'овый регекс, то в скрипте нужно закомментировать единственную активную строку и раскомментировать последнюю, которая применяет sed, но он работает немного медленнее конечно.

## 3. Массовый коммит и пуш

После изменений необходимо закоммитить всё и отправить в GitLab. Тут всё просто, но не без извращений. Следующую команду надо исполнить из директории с проектами:

```bash
$ for d in ./*/ ; do (cd "$d" && $(git commit -am '[commit-message]' 1>/dev/null) && if [[ "$(git push 2>&1)" != "Everything up-to-date" ]]; then printf "${${d%/}##*/},"; fi); done
```

Соответственно, вместо *[commit-message]* необходимо указать сообщение коммита, которое будет у всех проектов, у которых были сделаны изменения. Надо быть внимательным т.к. сюда могут попасть не связанные изменения сделанные до массовой замены выше.

По итогу работы команды будет выведен список директорий-репозиториев, которые подверглись изменению и были отправленных в GitLab.
