---
layout: post
status: draft
title: Популярные неисправности при начале работы Symfony 2 под Windows у новичков
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 699
wordpress_url: http://paperplane.su/?p=699
date: '2011-10-11 20:13:01 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>При запуске первой сессии страница приветствия не отсвечивается а вместо этого появляется ошибка<br />
Warning: session_start(): open(&#47;tmp\sess_5e6f319cf10f6e700f0d6925510cc796, O_RDWR) failed: No such file or directory (2) in d:\hosting\panachereport\members area\signup\TMP58ywnqn5na.php on line 2<br />
решение вопроса надо в php.ini прописать в переменной session.save_path полный путь до папки типа<br />
session.save_path = "e:\job\sites\localsites\denwer\tmp"</p>
<p>тм мужик тетке ответил в 3м посте там все написнно<br />
http:&#47;&#47;p2p.wrox.com&#47;beginning-php&#47;7689-warning-session_start.html</p>
<p>еще может быть проблема в том что нет правд доступа к папке с сессиями, тогда поступатькак написано тут<br />
http:&#47;&#47;www.java-samples.com&#47;showtutorial.php?tutorialid=1494</p>
<p>НЕ РАБОТАЕТ МОДУЛЬ mod_rewrite.c</p>
<p>для этого стоит поменять<br />
RewriteEngine On<br />
RewriteCond %{REQUEST_FILENAME} !-f<br />
RewriteRule ^(.*)$ app.php [QSA,L]</p>
<p>на это<br />
RewriteEngine On<br />
RewriteCond %{REQUEST_FILENAME} !-f<br />
RewriteRule ^(.*)$ app.php&#47;$1 [QSA,L]</p>
<p>Не работают команды в консоле</p>
<p>php app&#47;console doctrine:schema:create<br />
php app&#47;console doctrine:schema:update --force</p>
<p>выдается ошибка следующая</p>
<p>Estoy teniendo problemas a la hora de ejecutar el siguiente comando:<br />
doctrine:schema:update __force.</p>
<p>[ErrorException]</p>
<p>Notice: Undefined variable: className in &#47;Users&#47;gcaliba&#47;Desktop&#47;Symfony&#47;vendor&#47;doctrine&#47;lib&#47;Doctrine&#47;ORM&#47;Mapping&#47;Cla ssMetadataFactory.php line 343</p>
<p>решение очень простое надо строку 343 заменит на эту</p>
<p>throw MappingException::identifierRequired($class->name);</p>
<p>Там просто, чтото разрабы напустли и в спешке видеть не то написали. =)</p>
<p>&nbsp;</p>
<p>В случаи перехода на главную страницу может все пойти не так как вы хотели. Может произойти ошибка вида&nbsp;<em>Warning: session_start() [<a href="function.session-start">function.session-start<&#47;a>]: open() failed: No such file or directory...<&#47;em>. На экране отобразиться следующее:</p>
<p><a href="http:&#47;&#47;image.paperplane.su&#47;2011&#47;09&#47;symfony-error.jpg"><img title="Ошибка в Symfony 2 вида Warning: session_start() open() failed: No such file or directory (2) in " src="http:&#47;&#47;image.paperplane.su&#47;2011&#47;09&#47;symfony-error-640x185.jpg" alt="Ошибка в Symfony 2 вида Warning: session_start() open() failed: No such file or directory (2) in " width="640" height="185" &#47;><&#47;a></p>
<p>Это означает, что Symfony не может найти временную папку с созданными сессиями. Это все потому что путь к этой папке указан относительный, а нужен абсолютный. Для того чтобы исправить ошибку идем в<em>c:&#47;localsites&#47;denwer&#47;usr&#47;local&#47;php5&#47;php.ini<&#47;em>, находим там переменную&nbsp;<em>session.save_path<&#47;em>&nbsp;и меняем относительный путь к папке на абсолютный. Все готово. Перезапускам Denwer и наслаждаемся отличной работой фреймворка.</p>
