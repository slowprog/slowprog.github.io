---
layout: post
status: draft
title: Как настроить отображение формы
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 1382
wordpress_url: http://paperplane.su/?p=1382
date: '2011-10-01 05:01:38 +0400'
date_gmt: '2011-10-01 05:01:38 +0400'
categories:
- Symfony 2
tags: []
comments: []
---
<p>http:&#47;&#47;symfony.com&#47;doc&#47;2.0&#47;cookbook&#47;form&#47;form_customization.html Доброе время суток. Сегодня я решил опубликовать перевод статьи о кастомизации форм в Symfony2. Оригинал статьи находится на офсайта: <a title="How to customize Form Rendering" href="http:&#47;&#47;symfony.com&#47;doc&#47;2.0&#47;cookbook&#47;form&#47;form_customization.html" rel="nofollow" target="_blank">How to customize Form Rendering<&#47;a>. Не смог найти перевод данной статьи, потому и решил сделать свой. Думаю многим пригодится, тема очень нужная, т.к. без кастомизации красивых форм не сделать. Ну, собственно вот и перевод. Symfony предоставляет вам широкие возможности по настройки визуализации форм. В этом руководстве вы узнаете, как настроить все части формы с минимальными усилиями, не зависимо от того какой вы используете шаблонизатор Twig или PHP.</p>
<h2>Основы визуализации формы<&#47;h2><br />
Вспомним, что текстовая метка, ошибка и HTML-виджет формы могут быть легко визуализируется с помощью Twig функции <span class="pre">form_row<&#47;span> или PHP хелпера:[tab name='Twig']</p>
<pre>{{ form_row(form.age) }}<&#47;pre><br />
[&#47;tab] [tab name='PHP']</p>
<pre><?php echo $view['form']->row($form['age']) }} ?><&#47;pre><br />
[&#47;tab] [end_tabset]Вы также можете вывести каждую из трех частей поля в отдельности:[tab name='Twig']</p>
<pre>&nbsp;
<div>
    {{ form_label(form.age) }}<br />
    {{ form_errors(form.age) }}<br />
    {{ form_widget(form.age) }}<br />
<&#47;div><&#47;pre><br />
[&#47;tab] [tab name='PHP']</p>
<pre>
<div>
    <?php echo $view['form']->label($form['age']) }} ?><br />
    <?php echo $view['form']->errors($form['age']) }} ?><br />
    <?php echo $view['form']->widget($form['age']) }} ?><br />
<&#47;div><&#47;pre><br />
[&#47;tab] [end_tabset]В обоих случаях текстовая метка, ошибка и HTML-виджет визуализируются с использованием разметки, которая идет по умолчанию в Symfony. Например, оба приведенных выше шаблона отрендерят следующее:</p>
<pre class="symfony">
<div>
    <label for="form_age">Age<&#47;label></p>
<ul>
<li>This field is required<&#47;li><br />
    <&#47;ul><br />
    <input type="number" id="form_age" name="form[age]" &#47;><br />
<&#47;div><&#47;pre><br />
Для того чтобы посмотреть и быстро протестировать форму, вы можете визуализировать ее с помощью всего одной строки кода:[tab name='Twig']</p>
<pre>{{ form_widget(form) }}<&#47;pre><br />
[&#47;tab] [tab name='PHP']</p>
<pre><?php echo $view['form']->widget($form) }} ?><&#47;pre><br />
[&#47;tab] [end_tabset]В дальнейшем будет объясняться, как каждая часть формы может быть изменена на различных уровнях. Дополнительные сведения о рендеринге форм см. <a href="http:&#47;&#47;symfony.com&#47;doc&#47;2.0&#47;book&#47;forms.html#form-rendering-template" rel="nofollow"><em>Rendering a Form in a Template<&#47;em><&#47;a></p>
<h2>Что такое темы форм?<&#47;h2><br />
Symfony использует фрагменты форм - небольшие кусочки шаблона, который отображают только часть формы - визуализирующие все части формы -- текстовые метки, ошибки, поля ввода текста, выборки данных и т.д. Эти фрагменты определяются как в блоках Twig, так и в шаблонах PHP. <em>Тема<&#47;em> это не более чем набор фрагментов, которые вы хотите использовать при визуализации формы. Другими словами, если вы хотите настроить визуализацию одной части формы, не касаясь другой, то вам нужно будет импортировать <em>тему<&#47;em>, которая содержит настройки соответствующих фрагментов формы. Symfony поставляется с темой по умолчанию (<a title="Тема Symfony по умолчанию" href="https:&#47;&#47;github.com&#47;symfony&#47;symfony&#47;blob&#47;master&#47;src&#47;Symfony&#47;Bridge&#47;Twig&#47;Resources&#47;views&#47;Form&#47;form_div_layout.html. twig" rel="nofollow" target="_blank">form_div_layout.html.twig<&#47;a> в Twig и <em>FrameworkBundle:Form<&#47;em> в PHP), которая определяет визуализацию каждого фрагмента каждой части формы. В следующем разделе вы узнаете, как настроить тему, переопределив все или только некоторые из ее фрагментов. Например, когда визуализируется виджет типа <em>integer<&#47;em>, то генерируется поле типа <em>number<&#47;em>.[tab name="Twig"]</p>
<pre>{{ form_widget(form.age) }}<&#47;pre><br />
[&#47;tab] [tab name="PHP"]</p>
<pre><?php echo $view['form']->widget($form['age']) ?><&#47;pre><br />
[&#47;tab] [end_tabset]визуализируется в</p>
<pre class="symfony"><input type="number" id="form_age" name="form[age]" required="required" value="33" &#47;><&#47;pre><br />
В данном случаи Symfony использует фрагмент <em>integer_widget<&#47;em> для визуализации поля. Потому что тип поля <em>integer<&#47;em> и визуализируется только виджет (нет ни метки, ни ошибки). В Twig по умолчанию блок <em>integer_widget<&#47;em> находится в ранее упомянутом шаблоне <a title="Тема Symfony по умолчанию" href="https:&#47;&#47;github.com&#47;symfony&#47;symfony&#47;blob&#47;master&#47;src&#47;Symfony&#47;Bridge&#47;Twig&#47;Resources&#47;views&#47;Form&#47;form_div_layout.html. twig" rel="nofollow" target="_blank">form_div_layout.html.twig<&#47;a>. В PHP этот фрагмент находится в файле <em>integer_widget.html.php<&#47;em> расположенном в директории <em>FrameworkBundle&#47;Resources&#47;views&#47;Form<&#47;em>. Реализация фрагмента <em>integer_widget<&#47;em>по умолчанию выглядит так:[tab name="Twig"]</p>
<pre>{% block integer_widget %}<br />
    {% set type = type|default('number') %}<br />
    {{ block('field_widget') }}<br />
{% endblock integer_widget %}<&#47;pre><br />
[&#47;tab] [tab name="PHP"]</p>
<pre><!-- integer_widget.html.php --></p>
<p><?php echo $view['form']->renderBlock('field_widget', array('type' => isset($type) ? $type : "number")) ?><&#47;pre><br />
[&#47;tab] [end_tabset]Как вы сами можете видеть, этот фрагмент визуализирует еще один другой фрагмент - <em>field_widget<&#47;em>: [tab name="Twig"]</p>
<pre>{% block field_widget %}<br />
    {% set type = type|default('text') %}<br />
    <input type="{{ type }}" {{ block('widget_attributes') }} value="{{ value }}" &#47;><br />
{% endblock field_widget %}<&#47;pre><br />
[&#47;tab] [tab name="PHP"]</p>
<pre><!-- FrameworkBundle&#47;Resources&#47;views&#47;Form&#47;field_widget.html.php --></p>
<p><input<br />
    type="<?php echo isset($type) ? $view->escape($type) : "text" ?>"<br />
    value="<?php echo $view->escape($value) ?>"<br />
    <?php echo $view['form']->renderBlock('attributes') ?><br />
&#47;><&#47;pre><br />
[&#47;tab] [end_tabset]Дело в том, что фрагменты определяют какой HTML будет выводится в каждой части формы. Чтобы настроить форму, необходимо просто определить и изменить соответствующий фрагмент. И именно набор из этих фрагментов известен как "<em>тема<&#47;em>". И когда визуализируется форма, вы можете выбрать, какую тему вы хотите применить. В Twig тема - это отдельный файл шаблона и фрагменты - блоки определяемые в этом же файле. В PHP тема - это папка и фрагменты - отдельные файлы шаблонов в этой папке.</p>
<blockquote>
<h3>Какой блок настроить<&#47;h3><br />
В этом примере, настраиваемый фрагмент <em>integer_widget<&#47;em>, потому что необходимо переопределить HTML-виджет для всех полей типа <em>integer<&#47;em>. Если нужно настроить поле <em>textarea<&#47;em>, то необходим фрагмент <em>textarea_widget<&#47;em>. Как вы смогли заметить, название необходимого фрагмента представляет собой сочетание типа и части поля (например, widget, label, error, row). Таким образом, чтобы настроить отображение ошибок только для текстовых (text) полей ввода, вы должны настроить фрагмента <em>text_errors<&#47;em>. Однако, чаще, необходимо настроить визуализацию ошибки во <em>всех<&#47;em> полях. Это можно сделать настроив фрагмента <em>field_errors<&#47;em>. Это удобно для наследуемых типов полей. В частности, так как тип <em>text<&#47;em> расширяется от типа <em>field<&#47;em>, компонент формы будет сначала искать специфичный для типа фрагмент (например, text_errors) перед переходом к родительскому фрагменту, если такового не будет существовать (например, field_errors). Для получения дополнительной информации по этой теме смотрите <a title="Form Fragment Naming" href="http:&#47;&#47;symfony.com&#47;doc&#47;2.0&#47;book&#47;forms.html#form-template-blocks" rel="nofollow" target="_blank">Form Fragment Naming<&#47;a>.<&#47;blockquote></p>
<h2>Темизация формы<&#47;h2><br />
Для того чтобы увидеть всю мощь тематизации форм, предположим, что вы хотите обернуть каждое поле типа <em>number<&#47;em> тегом <em>div<&#47;em>. Ключ к решению задачи - это настройка фрагмента <em>integer_widget<&#47;em>.</p>
<h2>Темизация формы в Twig<&#47;h2><br />
При настройки поля формы в Twig, есть два варианта того, где может находиться настраиваемый блок:</p>
<table border="1">
<thead valign="bottom">
<tr>
<th>Метод<&#47;th></p>
<th>Плюс<&#47;th></p>
<th>Минус<&#47;th><br />
<&#47;tr><br />
<&#47;thead></p>
<tbody valign="top">
<tr>
<td>Внутри этого же шаблона как форма<&#47;td></p>
<td>Быстрый и легкий<&#47;td></p>
<td>Не может быть повторно использован в других шаблонах<&#47;td><br />
<&#47;tr></p>
<tr>
<td>Внутри отдельного шаблона<&#47;td></p>
<td>Может быть использован во множестве шаблонов<&#47;td></p>
<td>Требует создание дополнительного шаблона<&#47;td><br />
<&#47;tr><br />
<&#47;tbody><br />
<&#47;table><br />
Оба метода имеют один и тот же эффект, но применять их лучше в разных ситуациях.</p>
<h2>Метод 1: Внутри этого же шаблона как форма<&#47;h2><br />
Самый простой способ настроить фрагмент <span class="pre">integer_widget<&#47;span> состоит в том, чтобы настроить его непосредственно в шаблоне, который визуализирует форму.</p>
<pre class="symfony">{% extends '::base.html.twig' %}</p>
<p>{% form_theme form _self %}</p>
<p>{% block integer_widget %}</p>
<div>
        {% set type = type|default('number') %}<br />
        {{ block('field_widget') }}<br />
    <&#47;div><br />
{% endblock %}</p>
<p>{% block content %}<br />
{# render the form #}</p>
<p>{{ form_row(form.age) }}<br />
{% endblock %}<&#47;pre><br />
С помощью <span class="pre">{% form_theme form _self%}<&#47;span> Twig смотрит в этом же шаблоне при любом переопределении элементов формы. В данном случаи поле <span class="pre">form.age<&#47;span> типа <span class="pre">integer<&#47;span>, и когда этот виджет визуализируется, для кастамизации будет использован фрагмент <span class="pre">integer_widget<&#47;span>.</p>
<p>Недостатком этого метода является то, что этот фрагмент не может быть повторно использован при визуализации других форм в других шаблонах. Этот метод является наиболее применимым при настройке формы, которая применяется только в одном шаблоне вашего приложения. Если вы хотите повторно использовать свой фрагмент в нескольких (или всех) формах вашего приложения, то читайте об этом в следующем разделе.</p>
<h2>Метод 2: Внутри отдельного шаблона<&#47;h2><br />
Вы также можете разместить фрагмент <span class="pre">integer_widget<&#47;span> целиком в отдельном шаблон. Весь код и результат работы кода тот же, что и в предыдущем методе, но теперь его можно использовать повторно в других шаблонах:</p>
<pre class="symfony">{# src&#47;Acme&#47;DemoBundle&#47;Resources&#47;views&#47;Form&#47;fields.html.twig #}</p>
<p>{% block integer_widget %}</p>
<div>
        {% set type = type|default('number') %}<br />
        {{ block('field_widget') }}<br />
    <&#47;div><br />
{% endblock %}<&#47;pre><br />
Теперь, когда вы создали фрагмент с кастамизацией формы, вы должны сказать Symfony, чтобы он его использовал. Внутри шаблона, где вы на самом деле визуализируете форму, укажите Symfony использовать ваш шаблон с помощью тега <span class="pre">form_theme<&#47;span>:</p>
<pre class="symfony">{% form_theme form 'AcmeDemoBundle:Form:fields.html.twig' %}</p>
<p>{{ form_widget(form.age) }}<&#47;pre><br />
Когда виджет <span class="pre">form.age<&#47;span> будет визуализироваться, Symfony использует фрагмент <span class="pre">integer_widget<&#47;span> из нового шаблона и заворачивает тег <span class="pre">input<&#47;span> в блок <span class="pre">div<&#47;span>, указанный в этом фрагменте.</p>
<h2>Темизация формы в PHP<&#47;h2><br />
При использовании PHP в качестве движка шаблонов, единственный способ настроить визуализацию это создать новый файл шаблона - очень похоже на второй метод используемый в Twig.</p>
<p>Файл шаблона должен быть назван после фрагмента. Вы должны создать файл <span class="pre">integer_widget.html.php<&#47;span> для того, чтобы кастамизовать фрагмент <span class="pre">integer_widget.<&#47;span></p>
<pre class="symfony"><!-- src&#47;Acme&#47;DemoBundle&#47;Resources&#47;views&#47;Form&#47;integer_widget.html.php --></p>
<div>
    <?php echo $view['form']->renderBlock('field_widget', array('type' => isset($type) ? $type : "number")) ?><br />
<&#47;div><&#47;pre><br />
Теперь, когда вы создали фрагмент с кастамизацией формы, вы должны сказать Symfony, чтобы он его использовал. Внутри шаблона, где вы на самом деле визуализируете форму, укажите Symfony использовать ваш шаблон с помощью хелпера <span class="pre">setTheme<&#47;span>:</p>
<pre class="symfony"><?php $view['form']->setTheme($form, array('AcmeDemoBundle:Form')) ;?></p>
<p><?php $view['form']->widget($form['age']) ?><&#47;pre><br />
Когда виджет <span class="pre">form.age<&#47;span> будет визуализироваться, Symfony использует шаблон <span class="pre">integer_widget.html.php<&#47;span> и завернет тег <span class="pre">input<&#47;span> в блок <span class="pre">div<&#47;span>.</p>
<h2>Ссылка на основные блоки формы (особенность Twig)<&#47;h2><br />
Пока, для того чтобы переопределить конкретный блок в форме, лучшим методом является копировать блока по умолчанию из <a href="https:&#47;&#47;github.com&#47;symfony&#47;symfony&#47;blob&#47;master&#47;src&#47;Symfony&#47;Bridge&#47;Twig&#47;Resources&#47;views&#47;Form&#47;form_div_layout.html.twig" rel="nofollow">form_div_layout.html.twig<&#47;a>, вставить его в другой шаблон и настроить. В большинстве случаях, вы можете этого не делать, ссылаясь на базовый блок при настройке его.</p>
<p>Это легко сделать, но немного варьируется в зависимости от того, если ваши настройки форме блока в тот же шаблон, форма или отдельный шаблон.</p>
