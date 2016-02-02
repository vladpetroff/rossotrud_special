'use strict';

var gulp = require('gulp'),  //https://www.npmjs.com/package/gulp
		sass = require('gulp-sass'),  //https://www.npmjs.com/package/gulp-sass/
		jade = require('gulp-jade'), //https://www.npmjs.com/package/gulp-jade/
		debug = require('gulp-debug'),  //https://www.npmjs.com/package/gulp-debug/
		imagemin = require('gulp-imagemin'), //https://www.npmjs.com/package/gulp-imagemin/
		rename = require('gulp-rename'),  //https://www.npmjs.com/package/gulp-rename/
		autoprefixer = require('gulp-autoprefixer'),  //https://www.npmjs.com/package/gulp-autoprefixer/
		minifyCSS = require('gulp-minify-css'),  //https://www.npmjs.com/package/gulp-minify-css
		browserSync = require("browser-sync"),  //https://www.npmjs.com/package/browser-sync
		reload = browserSync.reload, //https://webref.ru/dev/automate-with-gulp/live-reloading
		uncss = require('gulp-uncss'); //https://www.npmjs.com/package/gulp-uncss/

var path = {
  dist: { //Тут мы укажем куда складывать готовые после сборки файлы
      html: 'dist/',
      jade: 'dist/',
      scripts: 'dist/js/',
      style: 'dist/css/',
      img: 'dist/img/',
  },
  src: { //Пути откуда брать исходники
      html: 'src/*.html', 
      jade: 'src/*.jade', 
      scripts: [
      	'src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
      	'src/bower_components/jquery/dist/jquery.min.js'
    	],
      style: [
      	'src/bower_components/bootstrap-sass/assets/stylesheets/bootstrap_custom.scss',
      	'src/css/*.css'
      ],
      img: 'src/img/**/*.*', 
  },
  watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
      html: 'dist/*.html',
      jade: 'src/**/*.jade', 
      scripts: 'src/js/**/*.js',
      style: [
      	'src/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss',
      	'src/css/*.css'
    	],
      img: 'src/img/**/*.*',
  },
  clean:{  /* Файлы, которые нужно удалить после сборки */
    html: 'dist/template',
  }
};


gulp.task('jade', function() {
  var YOUR_LOCALS = {};
 
  gulp.src(path.src.jade)
  	// .pipe(debug({title: "jade;"}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.dist.jade))
    .pipe(reload({stream:true}));
});

gulp.task('html', function(){
  gulp.src(path.watch.html)
  // .pipe(rigger())  // сборка футера, хидера,...
  .pipe(gulp.dest(path.dist.html))
  .pipe(reload({stream:true}));
});

/* Изменяем рабочие скрипты */
gulp.task('scripts', function(){
  gulp.src(path.watch.scripts)
  // .pipe(debug({title: "scripts;"}))
  .pipe(gulp.dest(path.dist.scripts))
  .pipe(reload({stream:true}));
});

/* Копируем скрипты из подключенных пакетов */
gulp.task('base_scripts', function(){
  gulp.src(path.src.scripts)
  // .pipe(debug({title: "base_scripts;"}))
  .pipe(gulp.dest(path.dist.scripts))
  .pipe(reload({stream:true}));
});

gulp.task('sass', function(){
  gulp.src(path.src.style) // Берет только _bootstrap.scss, другие не компилит
  // .pipe(debug({title: "sass;"}))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer('last 5 versions'))
  .pipe(gulp.dest(path.dist.style))
  .pipe(reload({stream:true}));
});

gulp.task('minify-css', function() {
  return gulp.src('dist/css/bootstrap_custom.css')
  	// .pipe(debug({title: "minifyCSS;"}))
	  .pipe(uncss({
	    html: [path.watch.html]
		}))
    .pipe(minifyCSS({keepBreaks:false}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.dist.style))
});

gulp.task('imagemin', function () {
  gulp.src(path.src.img)
  	// .pipe(debug({title: "imagemin;"}))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        // use: [pngquant()],
        interlaced: true
    }))
    .pipe(gulp.dest(path.dist.img))
    .pipe(reload({stream:true}));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: path.dist.html
    },
    port: 8080,
    open: true,
    notify: false
  });
});

// Если теперь запустить gulp watch, то sass и browserSync запустятся одновременно. 
// После выполнения обеих задач запустится watch.
gulp.task('watch', ['browserSync', 'jade', 'sass'], function () {
	gulp.watch(path.watch.style, ['sass' , 'minify-css']);
  // gulp.watch(path.watch.html, ['html']);
  gulp.watch(path.watch.jade, ['jade']);
  gulp.watch(path.watch.img, ['imagemin']);
  gulp.watch(path.watch.scripts, ['scripts']);
})

gulp.task('default', ['watch']);

gulp.task('build', ['sass' , 'jade', 'scripts', 'imagemin', 'minify-css', 'browserSync']);