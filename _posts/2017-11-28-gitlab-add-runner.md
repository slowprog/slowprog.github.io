---
layout: post
title: Добавление раннера в GitLab с помощью Docker
date: 2017-11-28T00:24:00+03:00
categories: DevOps
tags: [gitlab, runner, pipeline, docker]
---

У меня есть свой GitLab на отдельном сервере, необходимо к нему прикрутить сборку, тестирование и деплой приложения через GitLab CI и Docker. Избитая тема. Но начинать всё это нужно с того, что необходимо где-то собирать образы. Очевидно это будет сторонний сервер, где будет бегать [GitLab Runner](https://docs.gitlab.com/runner/). Данное руководство для тех кто хочет быстро это сделать, чтобы приступить уже к сборке приложения. Но вообще есть полная [документация на все случаи жизни](https://docs.gitlab.com/runner/install/index.html).

Результатом будет shared runner в своём GitLab, на своём сервере, в своём контейнере.

## 1. Поднять сервер

Обычно я вручную поднимаю сервер на [DigitalOcean](https://m.do.co/c/725161c49e20) сразу с Docker на борту. Там есть возможность one-click установки с нужным ПО. Оч удобно.

Но бывают случаи когда есть сервере (обычно это Ubuntu какая-нибудь), но на нём нет Docker и тогда всё очень просто:

```bash
$ curl -sSL https://get.docker.com/ | sh
```

Эта команда сама установить докер на машину, если его нет. А в том случае, если в процессе вам понадобится и docker-compose, то ещё и так:

```bash
$ apt-get update
$ apt-get -y install python-pip
$ pip install docker-compose
```

Всё, теперь точно имеем сервер c Docker на борту.

## 2. Запускаем runner

Для начала надо поднять контейнер с раннером на нашем сервере:

```bash
$ docker run -d --name gitlab-runner --restart always \
    -v /srv/gitlab-runner/config:/etc/gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock \
    gitlab/gitlab-runner:latest
```

После непродолжительной развёртки у вас будет готовый контейнер с раннером, который осталось зарегистрировать.

## 3. Регистрируем runner

Для этого необходимо в контейнере исполнить [соответствующую команду](https://docs.gitlab.com/runner/register/index.html#docker) и ответить на соответсвующие вопросы с умом, или без ума, но тогда придётся в самом GitLab менять конфигурацию раннера. Я предпочитаю закидывать сразу всё одной командой, чтобы не отвечать на вопросы.

Следующая команда конфигурирует и регистрирует раннер как мне нужно (privileged, locked, tags, etc) сразу без последующих настроек:

```bash
$ docker exec -it gitlab-runner gitlab-runner register -n \
    --url "https://gitlab.domain.com" \
    --registration-token token_registration \
    --tag-list docker \
    --executor docker \
    --description "Docker Runner" \
    --docker-image docker:latest \
    --docker-volumes /var/run/docker.sock:/var/run/docker.sock \
    --locked false
    --docker-privileged
```

Соответственно, в вашем варианте *https://gitlab.domain.com* и *token_registration* будут другие. Последний надо брать со страницы [администрирования раннеров в GitLab](https://docs.gitlab.com/ce/ci/runners/#registering-a-shared-runner).

## 4. Используем runner

Как видно из команды выше, в раннере будут процесситься только джобы помеченные тегом *docker* в *gitlab-ci.yml*.

Вот, например, мой простенький ci-конфиг для развёртки с помощью *docker-compose* всего, что попадает в master-ветку:

```yml
variables:
    DOCKER_DRIVER: overlay2
    CI_REGISTRY_IMAGE_WITH_TAG_BY_TAG: "$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME"
    CI_REGISTRY_IMAGE_WITH_TAG_BY_MASTER: "$CI_REGISTRY_IMAGE:latest"

stages:
    - build
    - deploy

build:
    stage: build
    image: docker:latest
    services:
      - docker:dind
    only:
      - master
    tags:
      - docker
    script:
      - docker login -u gitlab-ci-token -p $CI_JOB_TOKEN $CI_REGISTRY
      - docker build -t $CI_REGISTRY_IMAGE_WITH_TAG_BY_MASTER --no-cache=true .
      - docker push $CI_REGISTRY_IMAGE_WITH_TAG_BY_MASTER

deploy:
    stage: deploy
    image: gitlab/dind:latest
    services:
        - docker:dind
    only:
        - master
    tags:
        - docker
    before_script:
        - mkdir -p ~/.ssh
        - echo "$DEPLOY_SERVER_PRIVATE_KEY" | tr -d '\r' > ~/.ssh/id_rsa
        - chmod 600 ~/.ssh/id_rsa
        - eval "$(ssh-agent -s)"
        - ssh-add ~/.ssh/id_rsa
        - ssh-keyscan -H $DEPLOYMENT_SERVER_IP >> ~/.ssh/known_hosts
    script:
        - scp -r ./docker-compose.yml ./docker-compose.prod.yml root@${DEPLOYMENT_SERVER_IP}:~/
        - ssh root@$DEPLOYMENT_SERVER_IP "docker login -u gitlab-ci-token -p ${CI_JOB_TOKEN} ${CI_REGISTRY}; docker pull ${CI_REGISTRY_IMAGE_WITH_TAG_BY_MASTER}; docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop; docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
```

Соответственно, в вашем проекте обязательно должны быть переменные окружения *DEPLOY_SERVER_PRIVATE_KEY* и *DEPLOYMENT_SERVER_IP*, но это уже совсем другая история. Можете для примера почитать про варианты деплоя [тут](https://medium.com/@Empanado/simple-continuous-deployment-with-docker-compose-docker-machine-and-gitlab-ci-9047765322e1) или [тут](https://medium.com/@codingfriend/continuous-integration-and-deployment-with-gitlab-docker-compose-and-digitalocean-6bd6196b502a).
