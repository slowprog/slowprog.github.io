;(function ($, window, document, undefined) {
  'use strict';

  /**
   * ------------------------------------------------------------------------
   * Support SVG external content for older browsers - svg4everybody.js
   * ------------------------------------------------------------------------
   */
  svg4everybody();

  /**
   * ------------------------------------------------------------------------
   * Loading bar - nprogress.js
   * ------------------------------------------------------------------------
   */
  NProgress.configure({
    showSpinner: false,
    template: '<div class="bar" role="bar"><div class="peg"></div></div>'
  });

  // Show the progress bar
  NProgress.start();

  // Progress percentage
  // NProgress.set(0.4);

  // Increase randomly
  var interval = setInterval(function() { NProgress.inc(); }, 1000);

  // Trigger finish when page fully loaded
  $(window).on('load', function () {
    clearInterval(interval);
    NProgress.done();

    // show hero page after page is fully loaded
    $('.hero-container,.hero-profile').removeClass('is-loading');
  });

  /**
   * ------------------------------------------------------------------------
   * Progressive image loading - pil.js
   * ------------------------------------------------------------------------
   */

  Pil.init();

  /**
   * ------------------------------------------------------------------------
   * Generate ramdom posts
   * ------------------------------------------------------------------------
   */
  function generateRandomPosts() {
    var divRandomPosts = $('#random-posts');

    if (divRandomPosts.length == 0) {
      return;
    }

    $.get('/posts.json', function (data) {
      // Filter current post
      data = data.filter(function (item) {
        return item.url != window.location.pathname;
      })

      var postsCount      = data.length;
      var posts           = data;
      var randomIndexUsed = [];
      var counter         = 0;
      var numberOfPosts   = 5;

      divRandomPosts.append('<h3 class="randomPosts-heading">Ещё почитай</h3>');

      while (counter < numberOfPosts && counter < postsCount) {
        var randomIndex = Math.floor(Math.random() * postsCount);
        var postTitle   = posts[randomIndex].title;
        var postURL     = posts[randomIndex].url;
        var postDate    = posts[randomIndex].date;
        var postExcerpt = posts[randomIndex].excerpt;

        divRandomPosts.append('<div class="randomPosts-item"><a href="' + postURL + '"><div class="clearfix"><h3 class="randomPosts-itemTitle">' + postTitle + '</h3><p class="randomPosts-itemExcerpt">' + postExcerpt + '</p></div></a><div class="randomPosts-itemMeta">Опубликованно ' + postDate + '</div></div>');

        randomIndexUsed.push(randomIndex);

        counter++;
      }
    }, 'json');
  }


  // Only run once the page Document Object Model (DOM)
  // is ready for JavaScript code to execute.
  $(function () {
    var headerNavbar = $('.headerNavbar');

    // if url has a hash hide navbar
    if (window.location.hash) {
      headerNavbar.addClass('is-hidden');
    }

    // primary navigation slide-in effect
    $(window).on('scroll', {
      previousTop: 0
    },
    function () {
      //var navbarHeight = headerNavbar.height();
      var currentTop = $(window).scrollTop();
      // check if user is scrolling up
      if (currentTop < this.previousTop ) {
        // if scrolling up...
        if (currentTop > 0) {
          headerNavbar.addClass('is-visible').removeClass('is-hidden');
        } else {
          headerNavbar.removeClass('is-visible');
        }
      } else {
        // if scrolling down...
        //if (currentTop > navbarHeight)
        if (currentTop > 10) {
          headerNavbar.addClass('is-hidden').removeClass('is-visible');
        }
      }
      this.previousTop = currentTop;
    });

    /**
     * ------------------------------------------------------------------------
     * Tooltip init - tooltip.js
     * ------------------------------------------------------------------------
     */
     $('[data-toggle="tooltip"]').tooltip();

    /**
     * ------------------------------------------------------------------------
     * Add or wrap necessary classes to the elements
     * ------------------------------------------------------------------------
     */
    // make all images responsive
    $('.markdownBody img').addClass('img-responsive');

    // responsive table
    $('.markdownBody table').addClass('table table-hover');
    $('.markdownBody table').wrap('<div class="table-responsive"></div>');

    // responsive embed video
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');

    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');

    $('iframe[src*="slideshare.net"]').addClass('embed-responsive-item');
    $('iframe[src*="slideshare.net"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');

    // default button
    $('.markdownBody a[role="button"]').addClass('btn btn-default');

    // footnotes header
    var footnotesAnchor = '<a class="js-headerLink" href="#footnotes" aria-hidden="true"><span class="svg-icon icon-link"><svg><use xlink:href="/assets/icons/icons.min.svg#icon-link"></use></svg></span></a>';

    $('.footnotes').prepend('<hr><h4 id="footnotes">' + footnotesAnchor + 'Сноски</h4>');

    /**
     * ------------------------------------------------------------------------
     * Markdown body header link
     * ------------------------------------------------------------------------
     */
    var postHeader = '.markdownBody>h3,.markdownBody>h4,.archiveBody .archiveYear';

    $(postHeader).filter('[id]').each(function () {
      var header      = $(this),
          headerID    = header.attr('id'),
          anchorClass = 'js-headerLink',
          anchorIcon  = '<span class="svg-icon icon-link"><svg><use xlink:href="/assets/icons/icons.min.svg#icon-link"></use></svg></span>';

      if (headerID) {
        header.prepend($('<a />').addClass(anchorClass).attr({ 'href': '#' + headerID, 'aria-hidden': 'true' }).html(anchorIcon));
      }

      return this;
    });

    /**
     * ------------------------------------------------------------------------
     * Random posts init
     * ------------------------------------------------------------------------
     */
    generateRandomPosts();

    // random posts section footer
    $('.randomPosts').append('<div class="randomPosts-footer"><a class="btn btn-default btn-random" href="/archives/" role="button">Больше статей</a></div>');

    /**
     * ------------------------------------------------------------------------
     * Elevator - Scroll back to top button
     * ------------------------------------------------------------------------
     */
    $('.elevatorWrapper').append('<div class="elevator" role="button"><span class="svg-icon icon-chevron-up svg-baseline" aria-hidden="true"><svg><use xlink:href="/assets/icons/icons.min.svg#icon-chevron-up"></use></svg></span></div>');

    // browser window scroll (in pixels) after which the "back to top" link is shown
    var offset = 300,
      // browser window scroll (in pixels) after which the "back to top" link opacity is reduced
      offset_opacity = 1200,
      // duration of the top scrolling animation (in ms)
      scroll_top_duration = 700,
      // grab the "back to top" link
      $back_to_top = $('.elevator');

    // hide or show the "back to top" link
    $(window).scroll(function () {
      ( $(this).scrollTop() > offset ) ? $back_to_top.addClass('elevator-is-visible') : $back_to_top.removeClass('elevator-is-visible elevator-fade-out');
      if( $(this).scrollTop() > offset_opacity ) {
        $back_to_top.addClass('elevator-fade-out');
      }
    });

    // smooth scroll to top
    $back_to_top.on('click', function(event){
      event.preventDefault();
      $('body,html').animate({
        scrollTop: 0
        }, scroll_top_duration
      );
    });

    /**
     * ------------------------------------------------------------------------
     * Social share - Helps to pop-up a window on click
     * ------------------------------------------------------------------------
     */
    $('.socialShare-popup').on('click', function () {
      var width  = 670,
          height = 420,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = this.href,
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;

      window.open(url, '', opts);

      return false;
    });
  }); // END document ready function
})(jQuery, window, document);
