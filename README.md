# [SlowProg](http://slowprog.su)

[![Build Status](https://travis-ci.org/slowprog/slowprog.github.io.svg?branch=master)](https://travis-ci.org/slowprog/slowprog.github.io)

The uncompiled [Jekyll](https://jekyllrb.com) source code for [slowprog.su](http://slowprog.su). Fork from the repository of [MilanAryal](https://github.com/MilanAryal/milanaryal.github.io).

## Build

1. Install Jekyll `$ gem install jekyll`
2. Install gulp: `$ npm install -g gulp`
3. Install dependencies: `$ npm install`
4. Serve for dev server: `$ gulp watch`
5. Build for prod: `$ gulp build:jekyll`
6. Commit and push with generated assets.

## Page variables

Post / page supports the following variables:

* title (string)
* excerpt (string)
* image (string)
* lang (string)
* date (date) – date of publication, format YYYY-MM-DD HH:MM:SS Z.
* last_modified_at – (date) date of last modified of content, format YYYY-MM-DD HH:MM:SS Z, for example *2017-08-13T11:27:00+03:00*.
* robot – (string) content fo meta-tag robots.
* categories (array|string)
* tags (array|string)
* description (string)
* permalink (string)
* sitemap (boolean)
* redirect_from (string)

Add images to */src/uploads/* forlder, and reference them from */assets/images/*.