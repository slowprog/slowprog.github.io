'use strict';

// Load plugins
const gulp        = require('gulp');
const del         = require('del');
const watch       = require('gulp-watch');
const flatten     = require('gulp-flatten');
const rename      = require('gulp-rename');
const header      = require('gulp-header');
const pkg         = require('./package.json');
const eslint      = require('gulp-eslint');
const concat      = require('gulp-concat');
const uglify      = require('gulp-uglify');
const scssLint    = require('gulp-scss-lint');
const scss        = require('gulp-sass');
const prefix      = require('gulp-autoprefixer');
const minify      = require('gulp-cssnano');
const svgstore    = require('gulp-svgstore');
const svgmin      = require('gulp-svgmin');
const browserSync = require('browser-sync');
const cp          = require('child_process');
const image       = require('gulp-image');

// Browsers compability
const COMPATIBILITY = [
  'Chrome >= 35',
  'Firefox >= 38',
  'Edge >= 12',
  'Explorer >= 10',
  'iOS >= 8',
  'Safari >= 8',
  'Android >= 4',
  'Opera >= 12'
];

// Scripts source paths
const SCRIPTS_SRC = [
  'src/js/jquery.js',
  'src/js/bootstrap/transition.js',
  // 'src/js/bootstrap/alert.js',
  // 'src/js/bootstrap/button.js',
  // 'src/js/bootstrap/carousel.js',
  'src/js/bootstrap/collapse.js',
  // 'src/js/bootstrap/dropdown.js',
  // 'src/js/bootstrap/modal.js',
  'src/js/bootstrap/tooltip.js',
  // 'src/js/bootstrap/popover.js',
  // 'src/js/bootstrap/scrollspy.js',
  // 'src/js/bootstrap/tab.js',
  // 'src/js/bootstrap/affix.js',
  'src/js/nprogress.js',
  'src/js/pil.js',
  'src/js/svg4everybody.js',
  'src/js/scripts.js'
];

// Jekyll uncompiled files
const JEKYLL_SRC = [
  '_includes/**',
  '_layouts/**',
  '_pages/**',
  '_posts/**',
  'blog/**',
  'tags/**',
  'posts.json',
];

// Make npm command work on Windows platform
const npm = (process.platform === 'win32') ? 'npm.cmd' : 'npm';

// Banner template for files header
const banner = ['/*!',
  ' * <%= pkg.title %> (<%= pkg.url %>)',
  ' * Copyright ' + new Date().getFullYear() + ' <%= pkg.author %>',
  ' * Licensed under <%= pkg.license %> (https://github.com/slowprog/slowprog.github.io/blob/master/LICENSE)',
  ' */',
  '\n'
].join('\n');

// Remove pre-existing content from the folders
gulp.task('clean', function () {
  return del(['assets/js', 'assets/css', 'assets/fonts', 'assets/icons']);
});

gulp.task('clean:scripts', function () {
  return del(['assets/js']);
});

gulp.task('clean:styles', function () {
  return del(['assets/css']);
});

gulp.task('clean:fonts', function () {
  return del(['assets/fonts']);
});

gulp.task('clean:icons', function () {
  return del(['assets/icons']);
});

// Test scripts
gulp.task('test:scripts', function () {
  return gulp.src(['src/js/**/*.js', '!src/js/**/jquery.js', '!src/js/bootstrap/**'])
    .pipe(eslint('src/js/.eslintrc.json'))
    .pipe(eslint.format());
});

// Test styles
gulp.task('test:styles', function () {
  return gulp.src(['src/scss/**/*.scss', '!src/scss/bootstrap/**', '!src/scss/font-awesome/**'])
    .pipe(scssLint({ 'config': 'src/scss/.scss-lint.yml' }));
});

// Concatenate and minify scripts
gulp.task('build:scripts', ['clean'], function () {
  return gulp.src(SCRIPTS_SRC)
    .pipe(concat('scripts.js'))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest('assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'));
});

// Process and minify styles
gulp.task('build:styles', ['clean'], function () {
  return gulp.src('src/scss/styles.scss')
    .pipe(header(banner, { pkg : pkg }))
    .pipe(scss({ precision: 6, outputStyle: 'expanded' }))
    .pipe(prefix({ browsers: COMPATIBILITY }))
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({ discardComments: { removeAll: true } }))
    .pipe(gulp.dest('assets/css'));
});

// Process and minify icons
gulp.task('build:icons', ['clean'], function () {
  return gulp.src('src/icons/**/*.svg', { base: 'src/icons' })
    .pipe(svgmin())
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('assets/icons'));
});

// Process and minify images
gulp.task('build:images', ['clean'], function () {
  return gulp.src([
    './src/images/*',
    './src/uploads/*',
  ])
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      concurrent: 10
    }))
    .pipe(gulp.dest('assets/images'));
});

// Copy fonts
gulp.task('copy:fonts', ['clean'], function () {
  return gulp.src('src/fonts/**')
    .pipe(flatten())
    .pipe(gulp.dest('assets/fonts'));
});

// Default task
gulp.task('default', ['build:scripts', 'build:styles', 'build:icons', 'build:images', 'copy:fonts']);

// Remove pre-existing Jekyll build site content
gulp.task('clean:jekyll', function () {
  return del(['./_site']);
});

// Build the Jekyll site
gulp.task('build:jekyll', ['default'], function (done) {
  browserSync.notify('Compiling Jekyll, please wait!');

  return cp.spawn(npm, ['run', 'jekyll-build'], { stdio: 'inherit' })
  .on('close', done);
});

// Rebuild scripts and do page reload
gulp.task('rebuild:scripts', function () {
  return gulp.src(SCRIPTS_SRC)
    .pipe(concat('scripts.js'))
    .pipe(header(banner, { pkg : pkg }))
    .pipe(gulp.dest('./_site/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./_site/assets/js'))
    .pipe(browserSync.stream());
});

// Rebuild styles and do page reload
gulp.task('rebuild:styles', function () {
  return gulp.src('src/scss/styles.scss')
    .pipe(header(banner, { pkg : pkg }))
    .pipe(scss({ precision: 6, outputStyle: 'expanded' }))
    .pipe(prefix({ browsers: COMPATIBILITY }))
    .pipe(gulp.dest('./_site/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minify({ discardComments: { removeAll: true } }))
    .pipe(gulp.dest('./_site/assets/css'))
    .pipe(browserSync.stream());
});

// Rebuild images and do page reload
gulp.task('rebuild:images', function () {
  return gulp.src([
    './src/images/*',
    './src/uploads/*',
  ])
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      concurrent: 10
    }))
    .pipe(gulp.dest('assets/images'))
    .pipe(browserSync.stream());
});

// Rebuild Jekyll and do page reload
gulp.task('rebuild:jekyll', ['build:jekyll'], function () {
  browserSync.reload();
});

// Watch changes
gulp.task('watch', ['clean:jekyll', 'build:jekyll'], function () {
  browserSync({
    server: {
      baseDir: './_site'
    },
  });

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['rebuild:scripts']);
  // Watch .scss files
  gulp.watch('src/scss/**/*.scss', ['rebuild:styles']);
  // Watch images
  gulp.watch('src/images/*', ['rebuild:images']);
  // Watch Jekyll uncompiled files
  gulp.watch(JEKYLL_SRC, ['rebuild:jekyll']);
});
