---
layout: post
status: draft
title: Обновить PHP на Debian&#47;Ubuntu
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2803
wordpress_url: http://paperplane.su/?p=2803
date: '2013-03-05 14:43:44 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>5.3 http:&#47;&#47;www.web2works.co.uk&#47;blog2works&#47;how-to-upgrade-php-5-2-to-php-5-3-on-debian-lenny&#47;<br />
5.4 http:&#47;&#47;vjetnamnet.com&#47;how-to-install-php-5-4-on-debian-using-dotdeb-repository&#47;</p>
<p>а в конце вместо<br />
apt-get dist-upgrade<br />
вставить<br />
apt-get install php5</p>
<p>и далее по установке выбрать keep the local version currently installed, чтобы оставить старый php.ini</p>
<p>и на всякий это<br />
http:&#47;&#47;itarticles.org&#47;2012&#47;07&#47;04&#47;install-php-5-4-debian-6&#47;</p>
<p>после обновления могут выскочить ошибки и решать их так<br />
http:&#47;&#47;blog.tordeu.com&#47;?p=417</p>
<p>а после обновления модулей может быть так что они два раза пдключются в разных местех и чтобы этго избежать нужно в ручную комментрирвать<br />
http:&#47;&#47;blog.ciuly.com&#47;my-server&#47;php-warning-module-apc-already-loaded-in-unknown-on-line-0&#47;</p>
