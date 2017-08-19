---
layout: post
status: draft
title: Установка и настройка nginx c Apache
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2724
wordpress_url: http://paperplane.su/?p=2724
date: '2013-04-26 13:59:33 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>Допустим вы установили уже Apache к себе в систему по этому мануалу. Теперь нужно его отодвинуть на задний план, чтобы он занимался только PHP и не лез в дела мирские. Nginx будет на себя брать всю статику, а если потребуется исполнения PHP, то отдавать запрос Апачу и не более того.</p>
<p>Добавим в конец файла &#47;etc&#47;apt&#47;sources.list:</p>
<p>deb http:&#47;&#47;nginx.org&#47;packages&#47;debian&#47; squeeze nginx<br />
deb-src http:&#47;&#47;nginx.org&#47;packages&#47;debian&#47; squeeze nginx<br />
Добавим pgp ключ для репозитория</p>
<p>wget -q -O - http:&#47;&#47;nginx.org&#47;keys&#47;nginx_signing.key | apt-key add -<br />
Обновим репозитории:</p>
<p>apt-get update</p>
<p>&#47;&#47; вверху всё нужно чтобы установить из репозитория свежую версию</p>
<p>Доустановка модулей после установки apache. </p>
<p>apt-get install php5-memcache libapache2-mod-ruby php5-idn php-pear php5-imagick php5-imap php5-mhash php5-ming php5-pspell php5-recode php5-snmp php5-tidy php5-xsl</p>
<p>Итак сегодня я раскажу вам как поднять Веб сервер на маломощном компьютере или VDS &#47; VPS</p>
<p>Мной был взят сервер VDS в конфигурации CPU 2000 MHz, RAM 256 Mb, HDD 5 Gb (Debian). ( с рег.ру)</p>
<p>Делаем начальные действия необходимые нам для дальнейшей работы: </p>
<p>выставим пароль root и зайдем под ним<br />
sudo passwd root<br />
su</p>
<p>обновим информацию о пакетах, и обновим систему<br />
aptitude update<br />
aptitude upgrade</p>
<p>доставим некоторые пакеты, если ставились ОСь по минималке<br />
aptitude install wget make ssh openssh-server g++</p>
<p>Теперь нам необходимо изменить настройки apache для того, чтобы он не занимал 80й порт, на который нам и нужно повесить nginx.<br />
В &#47;etc&#47;apache2&#47;ports.conf меняем:<br />
NameVirtualHost *:80<br />
Listen 80<br />
на<br />
NameVirtualHost *:81<br />
Listen 81</p>
<p>правим конфиг апача ставим там следующие значения nano &#47;etc&#47;apache2&#47;apache2.conf</p>
<p>KeepAlive Off<br />
MaxClients 20</p>
<h2>Теперь ставим nginx<&#47;h2></p>
<p>Теперь собственно поставим nginx:<br />
debian-nginx:~# aptitude install nginx<br />
Далее открываем &#47;etc&#47;nginx&#47;nginx.conf и приводим его к примерно следующему виду:<br />
user www-data;<br />
worker_processes 1;<br />
error_log &#47;var&#47;log&#47;nginx-error.log;<br />
pid &#47;var&#47;run&#47;nginx.pid;<br />
events {<br />
worker_connections 1024;<br />
use epoll;<br />
}<br />
http {<br />
include &#47;etc&#47;nginx&#47;mime.types;<br />
access_log &#47;var&#47;log&#47;nginx-access.log;<br />
sendfile on;<br />
tcp_nodelay on;<br />
keepalive_timeout 4;<br />
client_max_body_size 100m;<br />
gzip on;<br />
gzip_disable &laquo;MSIE [1-6]\.(?!.*SV1)&raquo;;<br />
gzip_min_length 1024;<br />
gzip_comp_level 4;<br />
include &#47;etc&#47;nginx&#47;conf.d&#47;*.conf;<br />
include &#47;etc&#47;nginx&#47;sites-enabled&#47;*;<br />
}</p>
<p>Теперь нам необходимо создать запись для VirtualHost в nginx.<br />
Создаём, например, файл &#47;etc&#47;nginx&#47;sites-enabled&#47;example.ru (не используйте в названии этих файлов символ -) и запишем в него следующее:<br />
server {<br />
listen 80;<br />
server_name example.ru www.example.ru test.example.ru;<br />
root &#47;var&#47;www&#47;sites&#47;example.ru;<br />
server_name_in_redirect off;<br />
index index.php index.html index.htm;<br />
access_log &#47;var&#47;www&#47;logs&#47;example.ru&#47;access.log;<br />
error_page 500 502 503 504 &#47;50x.html;<br />
location = &#47;50x.html {<br />
root &#47;var&#47;www&#47;nginx-default;<br />
}<br />
location &#47; {<br />
proxy_set_header X-Real-IP $remote_addr;<br />
proxy_set_header Host $host;<br />
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;<br />
proxy_pass http:&#47;&#47;127.0.0.1:81;<br />
}<br />
location ~*<br />
^.+\.(jpg|jpeg|gif|png|rar|txt|tar|wav|bz2|exe|pdf|doc|xls|ppt|bmp|rtf|js|ico|css|zip|tgz|gz)$<br />
{<br />
root &#47;var&#47;www&#47;sites&#47;example.ru;<br />
expires 30d;<br />
access_log off;<br />
}<br />
location ~ &#47;\.ht {<br />
deny all;<br />
}<br />
}</p>
<p>Пробежимся по важным моментам конфига:<br />
server_name example.ru www.example.ru test.example.ru; &mdash; перечисляем все домены-алиасы для необходимого нам сайта.<br />
root &#47;var&#47;www&#47;sites&#47;example.ru; &mdash; корневой каталог сайта<br />
proxy_pass http:&#47;&#47;127.0.0.1:81; &mdash; IP и порт апача. В нашем случае связь между apache и nginx будет через локальную петлю.<br />
В дальнейшем вы обязательно столкнетесь с проблемой, что nginx не будет передавать IP адреса Апачу. Собственно, лучше учесть это сейчас, чтобы ваши скрипты на сайтах, работа которых основана на IP посетителя работали правильно. Здесь нам поможет mod_rpaf. Установим его:<br />
aptitude install libapache2-mod-rpaf</p>
<p>С такими настройками nginx у нас отдаёт всю статику (картинки, видиое, музыку, css, ява скрипты и др.), а апачь трудиться только над выполнением php.</p>
<p>Устанавливаем memcached:<br />
aptitude install memcached</p>
<p>а вообще все брать отсюда<br />
http:&#47;&#47;rubuntu.ru&#47;blog&#47;server&#47;435&#47;nastrojka-apache-2-nginx-php-5-mysql-memcached-eaccelerator-sphinx-v-ubuntu.html</p>
<p>и тут<br />
thttps:&#47;&#47;debian.pro&#47;147</p>
<p>а тут картинки наглядные, нарисуй такие же<br />
http:&#47;&#47;adw0rd.com&#47;2009&#47;3&#47;27&#47;nginx-and-apache-install&#47;<br />
еще там конфиги все подписаны, что круто!</p>
<p>тут можно посмотреть конфиг nginx, там воркеры в большом количестве<br />
http:&#47;&#47;www.lissyara.su&#47;articles&#47;freebsd&#47;www&#47;nginx+php-fpm+mysql&#47;</p>
<p>тут можно глянуть как создать страницу со статистикой nginx<br />
http:&#47;&#47;habrahabr.ru&#47;post&#47;56497&#47;</p>
<p>на счет ограничений с одного ip тут почитать, и даже количество коннектов по умолчанию с каждого браузера<br />
http:&#47;&#47;forum.firstvds.ru&#47;viewtopic.php?f=3&t=8858</p>
<p>Как определить количество рабочих процессов, задаваемых параметром worker_processes?<br />
http:&#47;&#47;www.httpd.kiev.ua&#47;tips&#47;nginx&#47;number-of-worker-processes&#47;</p>
<p>Свой лог событий который я написал по ходу действия</p>
<p>1) После установки всех необходимых пакетов (apache2 + phph5 + mysql + phpmyadmin + nginx + apache2-mod-rpaf, последний нужен для того чтобы Энджейн передавал Апачу реальный REMOTE_ADDR) пакетов нужно сменить порты прослушивания для всех. Пусть на 80 порту сидит nginx, а на 81 Апач.<br />
Это делать в nano &#47;etc&#47;apache2&#47;ports.conf<br />
NameVirtualHost *:81<br />
Listen 81</p>
<p>2) Возможно для Апача уменьши количество оновременно подключаемых клиентов в<br />
nano &#47;etc&#47;apache2&#47;apache2.conf<br />
MaxClients          20</p>
<p>3) Далее настроим ЭндейнХ. Для этого открываем &#47;etc&#47;nginx&#47;nginx.conf и приводим его к примерно следующему виду? который можно поглядеть в мануалах =)</p>
<p>4) Создаем виртуальный хост для энджейна.</p>
<p>5) Установил трансляцию настоящего IP и готово</p>
