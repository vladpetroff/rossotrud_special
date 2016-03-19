'use strict';

var gulp = require('gulp'),  //https://www.npmjs.com/package/gulp-4.0.build
	sass = require('gulp-sass'),  //https://www.npmjs.com/package/gulp-sass/
	jade = require('gulp-jade'), //https://www.npmjs.com/package/gulp-jade/
	debug = require('gulp-debug'),  //https://www.npmjs.com/package/gulp-debug/
	imagemin = require('gulp-imagemin'), //https://www.npmjs.com/package/gulp-imagemin/
	rename = require('gulp-rename'),  //https://www.npmjs.com/package/gulp-rename/
	autoprefixer = require('gulp-autoprefixer'),  //https://www.npmjs.com/package/gulp-autoprefixer/
	minifyCSS = require('gulp-minify-css'),  //https://www.npmjs.com/package/gulp-minify-css
	browserSync = require("browser-sync"),  //https://www.npmjs.com/package/browser-sync
	reload = browserSync.reload, //https://webref.ru/dev/automate-with-gulp/live-reloading
	uncss = require('gulp-uncss'), //https://www.npmjs.com/package/gulp-uncss/
	sourcemaps = require('gulp-sourcemaps'),  //https://www.npmjs.com/package/gulp-sourcemaps
	del = require('del'), //https://www.npmjs.com/package/del
	concat = require('gulp-concat-css'); // объединяет файлы-css

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
			'src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js'
			//'src/bower_components/jquery/dist/jquery.min.js'
		],
		style: [
			'src/css/*.css'
		],
		sass: [
			'src/css/*.scss'
		],
		img: 'src/img/**/*.*',
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: 'dist/*.html',
		jade: 'src/**/*.jade',
		scripts: 'src/js/**/*.js',
		sass: [
			'src/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss',
			'src/css/*.scss'
		],
		style: [
			'src/css/*.css'
		],
		img: 'src/img/**/*.*',
	},
	clean: {
		/* Файлы, которые нужно удалить после сборки */
		map: 'dist/css/*.map',
	}
};


gulp.task('jade', function () {
	var YOUR_LOCALS = {};

	return gulp.src(path.src.jade)
		// .pipe(debug({title: "jade;"}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(path.dist.jade))
		.pipe(reload({stream: true}));
});

gulp.task('html', function () {
	return gulp.src(path.watch.html)
		// .pipe(rigger())  // сборка футера, хидера,...
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({stream: true}));
});

/* Изменяем рабочие скрипты */
gulp.task('scripts', function () {
	return gulp.src(path.watch.scripts)
		// .pipe(debug({title: "scripts;"}))
		.pipe(gulp.dest(path.dist.scripts))
		.pipe(reload({stream: true}));
});

/* Копируем скрипты из подключенных пакетов */
gulp.task('base_scripts', function () {
	return gulp.src(path.src.scripts)
		// .pipe(debug({title: "base_scripts;"}))
		.pipe(gulp.dest(path.dist.scripts))
		.pipe(reload({stream: true}));
});

gulp.task('css', function () {
	/* в gulp4 перезаписывать не все, а только измененные файлы:
	gulp.src(path.src.style, {since: gulp.lastRun('css')}) */
	return gulp.src(path.src.style)
		//.pipe(debug({title: "css;"}))
		//.pipe(concat('style.css')) // объединяем файлы-css в один
		.pipe(gulp.dest(path.dist.style))
		.pipe(reload({stream: true}));
});

gulp.task('sass', function () {
	return gulp.src(path.src.sass)
		//.pipe(debug({title: "sass;"}))
		.pipe(sourcemaps.init()) // file получил пустой sourcemap
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 5 versions'))
		.pipe(sourcemaps.write('.'))  // заполняем sourcemap и кладем в тот же каталог отдельно
		.pipe(gulp.dest(path.dist.style))
		.pipe(reload({stream: true}));
});

gulp.task('clean', function () {
	return del(path.clean.map);
});

//gulp.task('minify-css', function () {
//	return gulp.src('dist/css/bootstrap_custom.css')
//		// .pipe(debug({title: "minifyCSS;"}))
//		.pipe(uncss({
//			html: [path.watch.html]
//		}))
//		.pipe(minifyCSS({keepBreaks: false}))
//		.pipe(rename({suffix: '.min'}))
//		.pipe(gulp.dest(path.dist.style))
//});

gulp.task('imagemin', function () {
	return gulp.src(path.src.img)
		// .pipe(debug({title: "imagemin;"}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			// use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.dist.img))
		.pipe(reload({stream: true}));
});

gulp.task('browserSync', function () {
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
//gulp.task('watch', ['browserSync', 'jade', 'css', 'sass'], function () {
//	gulp.watch(path.watch.style, ['css']);
//	gulp.watch(path.watch.sass, ['sass']);
//	gulp.watch(path.watch.jade, ['jade']);
//	gulp.watch(path.watch.img, ['imagemin']);
//	gulp.watch(path.watch.scripts, ['scripts']);
//})

gulp.task('default', ['watch']);

gulp.task('build', ['imagemin', 'clean']);

gulp.watch(path.watch.sass, ['sass']);
gulp.watch(path.watch.style, ['css']);