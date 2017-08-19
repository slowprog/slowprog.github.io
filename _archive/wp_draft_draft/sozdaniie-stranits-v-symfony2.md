---
layout: post
status: draft
title: Создание страниц в Symfony2
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 868
wordpress_url: http://paperplane.su/?p=868
date: '2011-08-30 19:17:58 +0400'
categories:
- Symfony 2
tags: []
comments: []
---
<p>Creating a new page in Symfony2 is a simple two-step process:<br />
Create a route: A route defines the URL (e.g. &#47;about) to your page and specifies a controller (which is a PHP function) that Symfony2 should execute when the URL of an incoming request matches the route pattern;<br />
Create a controller: A controller is a PHP function that takes the incoming request and transforms it into the Symfony2 Response object that's returned to the user.<br />
This simple approach is beautiful because it matches the way that the Web works. Every interaction on the Web is initiated by an HTTP request. The job of your application is simply to interpret the request and return the appropriate HTTP response.<br />
Symfony2 follows this philosophy and provides you with tools and conventions to keep your application organized as it grows in users and complexity.<br />
Sounds simple enough? Let's dive in!</p>
