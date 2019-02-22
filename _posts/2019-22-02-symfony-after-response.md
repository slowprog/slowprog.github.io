---
layout: post
title: Обработка запроса после отправки ответа в Symfony
date: 2019-02-22T04:30:00+03:00
categories: Мастерская
tags: [php, symfony, response]
---

PHP конечно не самый крутой язык, но [достаточно популярный](https://githut.info/). Хотя одна из причин его убогости это многопоточность – её нет. Там конечно есть разные костыли, но не суть. Проблематика данного поста в том что из-за отсутствия многопоточности вроде бы как есть трабл с вычислениями после отправки ответа с сервера.

Вру, конечно. Такой проблемы нет. Заголовки и тело ответа отправил, а потом делай, что хочешь ([источник кода](https://stackoverflow.com/a/15273676)):

```php
ob_start();
echo $response;
header('Connection: close');
header('Content-Length: '.ob_get_length());
ob_end_flush();
ob_flush();
flush();
// Тут уже можно продолжить вычисления.
```

Но, во-первых, это агли, а, во-вторых, мы то используем *самый лучший* фреймворк [Symfony](https://symfony.com). Там обычно отправка ответа означает окончание обработки данных, а код выше вставлять в контроллер рука не поднимается.

При внимательном прочтении документации мы видим из этого [упрощённого примера](https://symfony.com/doc/current/components/http_kernel.html#a-full-working-example), что в архитектуре Symfony предусмотрено событие terminate, которое исполняется после отправки ответа. Отлично, значит вешаемся на него и дело в шляпе.

Вот пример контроллера, который отправляет ответ сразу, а вычисления производит позже:

```php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class IndexController extends Controller
{
    public function indexAction(Request $request)
    {
        $this->get('event_dispatcher')->addListener(
            KernelEvents::TERMINATE,
            function (KernelEvent $event) {
                // Тут код с вычислениями.
            }
        );

        return new Response();
    }
}
```

Очевидно, никаких новых тредов, никакого распараллеливания, мы просто выполняем код немного в ином порядке. Данный подход понадобится когда надо быстро ответить, чтобы клиент не ждал (отвалится ещё), а дальше производить уже какие-то ресурсоёмкие / долгие вычисления. В особо тяжких случаях лучше использовать какую-нибудь очередь типа [RabbitMq](http://www.rabbitmq.com/) или [Beanstalkd](https://beanstalkd.github.io/). Но когда это не самая ответственная задача и вычисления там не очень толстые, то можно и так.