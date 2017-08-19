---
layout: post
status: draft
title: Примеры использования CodeColorer
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2675
wordpress_url: http://paperplane.su/?p=2675
date: '2012-11-21 05:24:14 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>http:&#47;&#47;kpumuk.info&#47;projects&#47;wordpress-plugins&#47;codecolorer&#47;examples&#47;</p>
<p>Я перешел на него и доволен. Но надо было все заменить и мне помог этот код</p>
<pre>
<?php </p>
<p>&#47;&#47; Соединяемся с БД<br />
$db = new \PDO('mysql:host=localhost;dbname=u4001808_default;charset=utf8', 'u4001808_default', 'lSyv3mST');</p>
<p>$entities = $db->prepare('select * from paper_posts');<br />
$entities->execute();<br />
$entities = $entities->fetchAll(\PDO::FETCH_OBJ);</p>
<p>foreach ( $entities as $entity ) {</p>
<p>	$entity->post_content = preg_replace('&#47;(
<pre class="brush:(.+)">)([^<]+)(<\&#47;pre>)&#47;', '[cce lang="$2"]$3[&#47;cce]', $entity->post_content);</p>
<p>	&#47;&#47; делаем изменения в базе<br />
	$update = $db->prepare('update paper_posts set post_content = :post_content where ID = :idPost');<br />
	$update->bindParam(':idPost', $entity->ID);<br />
	$update->bindParam(':post_content', $entity->post_content);<br />
	$update->execute();</p>
<p>	&#47;&#47; притормозим<br />
	sleep(1);<br />
}<br />
<&#47;pre></p>
