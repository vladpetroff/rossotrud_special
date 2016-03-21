'use strict';

var gulp = require('gulp'),  //https://www.npmjs.com/package/gulp-4.0.build
	sass = require('gulp-sass'),  //https://www.npmjs.com/package/gulp-sass/
	jade = require('gulp-jade'), //https://www.npmjs.com/package/gulp-jade/
	debug = require('gulp-debug'),  //https://www.npmjs.com/package/gulp-debug/
	imagemin = require('gulp-imagemin'), //https://www.npmjs.com/package/gulp-imagemin/
	rename = require('gulp-rename'),  //https://www.npmjs.com/package/gulp-rename/
	autoprefixer = require('gulp-autoprefixer'),  //https://www.npmjs.com/package/gulp-autoprefixer/
	//minifyCSS = require('gulp-minify-css'),  //https://www.npmjs.com/package/gulp-minify-css
	browserSync = require("browser-sync"),  //https://www.npmjs.com/package/browser-sync
	reload = browserSync.reload, //https://webref.ru/dev/automate-with-gulp/live-reloading
	uncss = require('gulp-uncss'), // Удаляет неиспользуемые стили. https://www.npmjs.com/package/gulp-uncss/
	sourcemaps = require('gulp-sourcemaps'),  //https://www.npmjs.com/package/gulp-sourcemaps
	del = require('del'), // Удаляет файлы. https://www.npmjs.com/package/del
	newer = require('gulp-newer'), // копирует только новые файлы. https://www.npmjs.com/package/gulp-newer
	notify = require('gulp-notify'),// Обработка ошибок. https://www.npmjs.com/package/gulp-notify
	concat = require('gulp-concat-css'); // объединяет файлы-css

var path = {
	dist: { //Тут мы укажем куда складывать готовые после сборки файлы
		html: 'dist/',
		jade: 'dist/',
		scripts: 'dist/js/',
		style: 'dist/css/',
		fonts: 'dist/fonts/',
		img: 'dist/img/'
	},
	src: { // Пути откуда копируем исходники
		scripts: [
			'src/js/**/*.js',
			'src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
			//'src/bower_components/jquery/dist/jquery.min.js'
		],
		fonts: 'src/fonts/**/*.*'
	},
	watch: { // Укажем, за изменением каких файлов мы хотим наблюдать
		html: 'dist/*.html',
		jade: 'src/**/*.jade',
		scripts: 'src/js/**/main.js',
		sass: [
			'src/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss',
			'src/css/*.scss'
		],
		style: 'src/css/*.css',
		img: 'src/img/**/*.*'
	},
	clean: { // Файлы, которые нужно удалить после сборки
		map: 'dist/css/*.map',
		includes: 'dist/includes'
	}
};

gulp.task('jade', function () {
	return gulp.src(path.watch.jade)
		// .pipe(debug({title: "jade;"}))
		.pipe(jade({
			pretty: true
		}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(newer(path.dist.jade))
		.pipe(gulp.dest(path.dist.jade))
		.pipe(reload({stream: true}));
});

gulp.task('html', function () {
	return gulp.src(path.watch.html, {since: gulp.lastRun('html')})
		// .pipe(rigger())  // сборка футера, хидера,...
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(newer(path.dist.html))
		.pipe(gulp.dest(path.dist.html))
		.pipe(reload({stream: true}));
});

/* Изменяем рабочие скрипты */
gulp.task('scripts', function () {
	return gulp.src(path.watch.scripts, {since: gulp.lastRun('scripts')})
		// .pipe(debug({title: "scripts;"}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(newer(path.dist.scripts))
		.pipe(gulp.dest(path.dist.scripts))
		.pipe(reload({stream: true}));
});

/* Копируем скрипты из подключенных пакетов */
gulp.task('base_scripts', function () {
	return gulp.src(path.src.scripts)
		// .pipe(debug({title: "base_scripts;"}))
		.pipe(newer(path.dist.scripts))
		.pipe(gulp.dest(path.dist.scripts))
});

/* Копируем шрифты */
gulp.task('fonts', function () {
	return gulp.src(path.src.fonts)
		.pipe(newer(path.dist.fonts))
		.pipe(gulp.dest(path.dist.fonts))
		//.pipe(debug({title: "fonts;"}))
		.pipe(reload({stream: true}));
});

gulp.task('css', function () {
	// {since: gulp.lastRun('css')} - обрабатывает только последние изменные файлы
	return gulp.src(path.watch.style, {since: gulp.lastRun('css')})
		//.pipe(debug({title: "css;"}))
		//.pipe(concat('style.css')) // объединяем файлы-css в один
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(newer(path.dist.style))
		.pipe(gulp.dest(path.dist.style))
		.pipe(reload({stream: true}));
});

gulp.task('sass', function () {
	return gulp.src(path.watch.sass, {since: gulp.lastRun('sass')})
		//.pipe(debug({title: "sass;"}))
		.pipe(newer(path.dist.style))
		.pipe(sourcemaps.init()) // file получил пустой sourcemap
		.pipe(sass())
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(autoprefixer('last 5 versions'))
		.pipe(sourcemaps.write('.'))  // заполняем sourcemap и кладем в тот же каталог отдельно
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
		}))
		.pipe(gulp.dest(path.dist.style))
		.pipe(reload({stream: true}));
});

gulp.task('clean', function () {
	return del([path.clean.includes, path.clean.map]);
});

////gulp.task('minify-css', function () {
////	return gulp.src('dist/css/bootstrap_custom.css')
////		// .pipe(debug({title: "minifyCSS;"}))
////		.pipe(uncss({
////			html: [path.watch.html]
////		}))
////		.pipe(minifyCSS({keepBreaks: false}))
////		.pipe(rename({suffix: '.min'}))
////		.pipe(gulp.dest(path.dist.style))
////});
//
gulp.task('imagemin', function () {
	return gulp.src(path.watch.img)
		.pipe(newer(path.dist.img))
		//.pipe(debug({title: "imagemin;"}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			// use: [pngquant()],
			interlaced: true
		}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error!!!"
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


gulp.task('watch', function() {
	gulp.watch(path.watch.style, gulp.series('css'));
	gulp.watch(path.watch.sass, gulp.series('sass'));
	gulp.watch(path.watch.scripts, gulp.series('scripts'));
	gulp.watch(path.watch.jade, gulp.series('jade'));
	gulp.watch(path.watch.img, gulp.series('imagemin'));
});

gulp.task('default', gulp.series(
	//'clean',
	gulp.parallel('jade', 'css', 'sass', 'scripts', 'base_scripts', 'fonts', 'imagemin', 'browserSync', 'watch')
	)
);

gulp.task('build', gulp.series(
	/* Выполнится первым */
	'clean',
	/* Выполнятся параллельно */
	gulp.parallel('imagemin'))
);
