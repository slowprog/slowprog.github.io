---
layout: post
status: draft
title: Плейсхолдер своими руками
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2822
wordpress_url: http://paperplane.su/?p=2822
date: '2013-03-06 20:29:35 +0400'
categories:
- Блог
tags: []
comments: []
---
<p>http:&#47;&#47;paulmason.name&#47;item&#47;descriptions-in-text-fields</p>
<p>и переработка из марекса</p>
<p><input id="my_text_input" placeholder="My Text Input" &#47;></p>
<p>jQuery(document).ready(function() {<br />
	&#47;&#47; установка вручную с помощью JS плейсолдеров (подсказок везде где они есть)<br />
	$('input [placeholder]').each(function(){<br />
		var default_value = $(this).attr('placeholder');<br />
		$(this).addClass('default_value');<br />
		$(this).value = default_value;<br />
		&#47;&#47; click into text field<br />
		$(this).addEvent('focus', function(){<br />
			if (this.value == default_value) {<br />
				this.value = '';<br />
				$(this).removeClass('default_value');<br />
			}<br />
		});<br />
		&#47;&#47; click out of text field<br />
		$(this).addEvent('blur', function(){<br />
			if(this.value=='') {<br />
				this.value = default_value;<br />
				$(this).addClass('default_value');<br />
			}<br />
		});<br />
	});<br />
});</p>
