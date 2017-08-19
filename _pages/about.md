---
layout: page
title: "Омне"
description: "Чуток за меня."
image: "/assets/images/about.jpg"
permalink: /about/
---

Доброго времени суток, меня особо никак не зовут (может быть конечно потом я напишу тут своё имя, и позже эту лалочку можно будет увидеть в ранних коммитах), пока я просто SlowProg, потому что кожу медленно, но кожу. Могу в бекенд, в основном, на пиэчпи, но потяну и жаву и руби там разные, а может быть даже и кложуры модные. Могу немного во фронтенд, всякие там сиэсэсы, жёванные скрипты и вот это всё. Ну, и администрирование линуксов на пол шишечки, чего греха таить. В общем-то, хвастаться нечем.

## Законтачиться хотишь?

Не рекомендую, да и выбор невелик, но можно меня видеть тут:

<!-- Social links -->
<ul class="social-links">
  {% if site.author.twitter %}
    <li>
      <a rel="me" href="//twitter.com/{{ site.author.twitter }}">
        <span class="svg-icon svg-baseline" aria-hidden="true">
          <svg><use xlink:href="/assets/icons/icons.min.svg#icon-twitter"></use></svg>
        </span><br><span class="label">Twitter</span>
      </a>
    </li>
  {% endif %}
  {% if site.author.facebook %}
    <li>
      <a rel="me" href="//facebook.com/{{ site.author.facebook }}">
        <span class="svg-icon svg-baseline" aria-hidden="true">
          <svg><use xlink:href="/assets/icons/icons.min.svg#icon-facebook"></use></svg>
        </span><br><span class="label">Facebook</span>
      </a>
    </li>
  {% endif %}
  {% if site.author.instagram %}
  <li>
     <a rel="me" href="//instagram.com/{{ site.author.instagram }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-instagram"></use></svg>
      </span><br><span class="label">Instagram</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.github %}
  <li>
    <a rel="me" href="//github.com/{{ site.author.github }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-github"></use></svg>
      </span><br><span class="label">GitHub</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.keybase %}
  <li>
    <a rel="me" href="//keybase.io/{{ site.author.keybase }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-key"></use></svg>
      </span><br><span class="label">Keybase</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.google_plus %}
  <li>
    <a rel="me" href="//google.com/+{{ site.author.google_plus }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-google-plus"></use></svg>
      </span><br><span class="label">Google+</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.linkedin %}
  <li>
    <a rel="me" href="//linkedin.com/in/{{ site.author.linkedin }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-linkedin"></use></svg>
      </span><br><span class="label">LinkedIn</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.pinterest %}
  <li>
    <a rel="me" href="//pinterest.com/{{ site.author.pinterest }}">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-pinterest"></use></svg>
      </span><br><span class="label">Pinterest</span>
    </a>
  </li>
  {% endif %}
  {% if site.author.tumblr %}
  <li>
    <a rel="me" href="//{{ site.author.tumblr }}.tumblr.com">
      <span class="svg-icon svg-baseline" aria-hidden="true">
        <svg><use xlink:href="/assets/icons/icons.min.svg#icon-tumblr"></use></svg>
      </span><br><span class="label">Tumblr</span>
    </a>
  </li>
  {% endif %}
</ul>

Контент я выдаю не особо потребный, в основном для себя любимого, но может быть кто-то найдёт для себя применение.

## Осайте

Решил я в очередной раз блог сделать, но в этот раз я не хотел вордпрессы модные, и не хотел всё совсем с нуля делать, а подумал, что нормал будет на GitHub Pages замутить. Тут конечно куча преимуществ, даже перечислять не охота, но я парочку упомяну: всё на маркдауне, статика, быстро, весело, бесплатно и т.д.

В целом, для этой радости использовалось следующее:

* Православный OS X для запуска ПО.
* [Atom](http://atom.io/) или [Visual Studio Code](https://code.visualstudio.com) для набора текста.
* [Bootstrap](http://getbootstrap.com/) для \"временного\" прототипирования дезигна.
* [Jekyll](http://jekyllrb.com/) для сборки в статику.
* [GitHub Pages](http://pages.github.com/) для размещения.

Вообще, по большому счёту, тема слизана с [MilanAryal](https://github.com/MilanAryal/milanaryal.github.io), но во многом я с ним согласен, дезигн-виденье наше сопадает. Ему конечно большое спасибо, а то самому было бы лень всё с нуля лабать.