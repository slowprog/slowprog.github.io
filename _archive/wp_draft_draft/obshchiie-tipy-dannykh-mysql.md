---
layout: post
status: draft
title: Общие типы данных MySQL
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2797
wordpress_url: http://paperplane.su/?p=2797
date: '2013-03-24 13:40:51 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>Небольшая заметка про данные MySQL. А точнее про поля, которые нужно часто использовать. Просто при разработке новой базы данных каждый раз приходится заново (или почти) продумывать поля, а точнее типы полей, которые целесообразно в данном случае использовать. Да, у большинства полей индивидуальный подход к их типам в зависимости от ситуации, но, в принципе, можно выделить основные типы для постоянно используемых полей. Именно это я тут и хочу сделать - составить справочную таблицу с часто используемыми полями. Если вы с чем-то не согласны или хотите дополнить эту таблицу, то пишите в комментарии, обсудим.</p>
<table width="100%" border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<th>Поле<&#47;th>
<th>Тип<&#47;th>
<th>Комментарий<&#47;th><&#47;tr></p>
<tr>
<td>id <br><&#47;td></p>
<td>INT(11)<&#47;td></p>
<td>AUTO_INCREMENT, UNSIGNED<&#47;td><br />
<&#47;tr><br />
<tr>
<td>page_name<br><&#47;td></p>
<td>VARCHAR(64)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td>meta_title<br><&#47;td></p>
<td>VARCHAR(150)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td>meta_description<br><&#47;td></p>
<td>VARCHAR(160)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td>meta_keyword<br><&#47;td></p>
<td>VARCHAR(255)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td>status<&#47;td></p>
<td>enum('ENABLED','DISABLED')<&#47;td></p>
<td>DEFAULT "DISABLED"<&#47;td><br />
<&#47;tr><br />
<tr>
<td valign="top">featured<&#47;td></p>
<td valign="top">TINYINT(1)<&#47;td></p>
<td valign="top">DEFAULT "0"<&#47;td><br />
<&#47;tr><br />
<tr>
<td>content<&#47;td></p>
<td>TEXT<&#47;td></p>
<td><br><&#47;td><br />
<&#47;tr><br />
<tr>
<td valign="top">username<&#47;td></p>
<td valign="top">VARCHAR(32)<&#47;td></p>
<td valign="top">
<&#47;td><&#47;tr><br />
<tr>
<td valign="top">password<&#47;td></p>
<td valign="top">VARCHAR(64)<&#47;td></p>
<td valign="top">
<&#47;td><&#47;tr><br />
<tr>
<td>email<&#47;td></p>
<td>VARCHAR(130)<br><&#47;td></p>
<td><br><&#47;td><br />
<&#47;tr><br />
<tr>
<td>phone&#47;mobile<&#47;td></p>
<td>VARCHAR(20)<br><&#47;td></p>
<td><br><&#47;td><br />
<&#47;tr><br />
<tr>
<td valign="top">firstname&#47;company<&#47;td></p>
<td valign="top">VARCHAR(32)<br><&#47;td></p>
<td valign="top"><br><&#47;td><br />
<&#47;tr><br />
<tr>
<td valign="top">address_1<&#47;td></p>
<td valign="top">VARCHAR(128)<&#47;td></p>
<td valign="top">
<&#47;td><&#47;tr><br />
<tr>
<td valign="top">postcode<&#47;td></p>
<td valign="top">VARCHAR(10)<&#47;td></p>
<td valign="top">
<&#47;td><&#47;tr><br />
<tr>
<td>file<&#47;td></p>
<td>VARCHAR(255)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td>price<&#47;td></p>
<td><span>DECIMAL (7,2)<&#47;span><&#47;td></p>
<td>&nbsp;<span>UNSIGNED<&#47;span><&#47;td><br />
<&#47;tr><br />
<tr>
<td>order<&#47;td></p>
<td>INT(11)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><br />
<tr>
<td valign="top">ip<&#47;td></p>
<td valign="top">VARCHAR(15)<&#47;td></p>
<td valign="top">DEFAULT "0"<&#47;td><br />
<&#47;tr><br />
<tr>
<td>modified<&#47;td></p>
<td>TIMESTAMP<&#47;td></p>
<td>on update CURRENT_TIMESTAMP<&#47;td><br />
<&#47;tr><br />
<tr>
<td>create<&#47;td></p>
<td>DATETIME<&#47;td></p>
<td>DEFAULT "0000-00-00 00:00:00"<&#47;td><br />
<&#47;tr><br />
<tr>
<td>forien_key<&#47;td></p>
<td>INT(11)<&#47;td></p>
<td>&nbsp;<&#47;td><br />
<&#47;tr><&#47;tbody><&#47;table></p>
<p>http:&#47;&#47;www.web2works.co.uk&#47;blog2works&#47;common-mysql-data-types&#47;</p>
