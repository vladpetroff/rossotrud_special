'use strict';

const gulp = require('gulp');  //https://www.npmjs.com/package/gulp-4.0.build
const sass = require('gulp-sass');  //https://www.npmjs.com/package/gulp-sass/
const jade = require('gulp-jade'); //https://www.npmjs.com/package/gulp-jade/
const debug = require('gulp-debug');  //https://www.npmjs.com/package/gulp-debug/
const imagemin = require('gulp-imagemin'); //https://www.npmjs.com/package/gulp-imagemin/
const rename = require('gulp-rename');  //https://www.npmjs.com/package/gulp-rename/
const browserSync = require("browser-sync").create();  //https://www.npmjs.com/package/browser-sync
const uncss = require('gulp-uncss'); // Удаляет неиспользуемые стили. https://www.npmjs.com/package/gulp-uncss/
const sourcemaps = require('gulp-sourcemaps');  //https://www.npmjs.com/package/gulp-sourcemaps
const del = require('del'); // Удаляет файлы. https://www.npmjs.com/package/del
const newer = require('gulp-newer'); // копирует только новые файлы. https://www.npmjs.com/package/gulp-newer
const concat = require('gulp-concat-css'); // объединяет файлы-css

/* Обработка ошибок */
const notify = require('gulp-notify'); // https://www.npmjs.com/package/gulp-notify
const plumber = require('gulp-plumber'); // передает onError через все потоки по цепочке

const webpackStream  = require('webpack-stream');
const webpack = webpackStream.webpack;
const wpath = require('path');
const autoprefixer = require('gulp-autoprefixer');  //https://www.npmjs.com/package/gulp-autoprefixer/
const minifyCSS = require('gulp-minify-css');  //https://www.npmjs.com/package/gulp-minify-css
const named = require('vinyl-named');  //определяет какой файл в какую сборку по названию
const gulplog = require('gulplog');
//const svgSprite = require('gulp-svg-sprite'); //https://www.youtube.com/watch?v=VqYAitDKbpo&list=PLDyvV36pndZFLTE13V4qNWTZbeipNhCgQ&index=13

/************************************************/

const path = {
	public: { //Тут мы укажем куда складывать готовые после сборки файлы
		html: 'public/',
		jade: 'public/',
		scripts: 'public/js/',
		style: 'public/css/',
		fonts: 'public/fonts/',
		img: 'public/img/'
	},
	src: { // Пути откуда копируем исходники
		scripts: [
			'assets/js/**/*.js',
			'src/bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
			//'src/bower_components/jquery/public/jquery.min.js'
		],
		style: 'assets/css/*.css',
		fonts: 'src/fonts/**/*.*',
		assets: 'assets/**/*.*'
	},
	watch: { // Укажем, за изменением каких файлов мы хотим наблюдать
		html: 'public/*.html',
		jade: 'src/**/*.jade',
		scripts: 'src/js/*.js', // только скрипты верхнего уровня
		sass: [
			'src/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.scss',
			'src/css/*.scss'
		],
		style: 'src/css/*.css',
		img: 'src/img/**/*.*'
	},
	clean: { // Файлы, которые нужно удалить после сборки
		map: 'public/css/*.map',
		jsmap: 'public/js/*.map',
		includes: 'public/includes',
		modules: 'public/js/modules'
	}
};

/************************************************/

gulp.task('jade', function () {
	return gulp.src(path.watch.jade)
		// .pipe(debug({title: "jade;"}))
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Jade',
					message: err.message
				};
			})
		}))
		.pipe(jade({
			pretty: true
		}))
		.pipe(newer(path.public.jade))
		.pipe(gulp.dest(path.public.jade))
});

gulp.task('html', function () {
	return gulp.src(path.watch.html, {since: gulp.lastRun('html')})
		// .pipe(rigger())  // сборка футера, хидера,...
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'HTML',
					message: err.message
				};
			})
		}))
		.pipe(newer(path.public.html))
		.pipe(gulp.dest(path.public.html))
});

gulp.task('sass', function () {
	return gulp.src(path.watch.sass, {since: gulp.lastRun('sass')})
		//.pipe(debug({title: "sass;"}))
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Sass',
					message: err.message
				};
			})
		}))
		.pipe(newer(path.public.style))
		.pipe(sourcemaps.init()) // file получил пустой sourcemap
		.pipe(sass())
		.pipe(autoprefixer('last 5 versions'))
		.pipe(sourcemaps.write('.'))  // заполняем sourcemap и кладем в тот же каталог отдельно
		.pipe(gulp.dest(path.public.style))
});

gulp.task('webpack', function(callback) {
	// сигнализируем об окончании сборки, чтоб не подвешивать поток
	let firstBuildReady = false;

	function done(err, stats) {
		firstBuildReady = true;

		if (err) { // hard error - ломает сборку
			return;
		}

		gulplog[stats.hasErrors() ? 'error' : 'info'](stats.toString({
			colors: true
		}));
	}

	let options = {
		output: {
			publicPath: '/js/' // необходимо для динамической подгрузки скриптов
		},

		watch: true,
		devtool: 'source-map',

		/* loader - это то, что преобразовывает файлы */
		module: {
			loaders: [{
					test: /\.js$/,
					include: wpath.join(__dirname, path.watch.scripts),
					exclude: /(node_modules|bower_components)/,
					//loader:  'babel?presets[]=es2015'
					loader: 'babel',
					query: {
						presets: ['es2015'],
						plugins: ['transform-runtime']
					}
				}
				//,
				//{
				//	test: /\.jade/,
				//	loader: 'jade'
				//}
			]
		},

		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			})
		]
	};

	return gulp.src(path.watch.scripts)
		.pipe(plumber({
			errorHandler: notify.onError(err => ({
				title: 'Webpack',
				message: err.message
			}))
		}))
		.pipe(named())
		.pipe(webpackStream(options, null, done))
		.pipe(gulp.dest(path.public.scripts))
		.on('data', function() { // эмулируем завершение сборки (хак)
			if (firstBuildReady) {
				callback();
			}
		});
});

gulp.task('assets', function () {
	return gulp.src(path.src.assets, {since: gulp.lastRun('assets')})
		//.pipe(debug({title: "assets;"}))
		.pipe(newer(path.src.assets))
		.pipe(gulp.dest('public'))
});

gulp.task('clean', function () {
	return del([path.clean.includes, path.clean.jsmap, path.clean.map, path.clean.modules]);
});

gulp.task('minify-css', function () {
	return gulp.src('public/css/style.css')
		//.pipe(debug({title: "minifyCSS;"}))
		.pipe(uncss({
			html: [path.watch.html]
		}))
		.pipe(minifyCSS({keepBreaks: false}))
		//.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.public.style))
});

gulp.task('imagemin', function () {
	return gulp.src(path.watch.img)
		.pipe(plumber({
			errorHandler: notify.onError(function(err) {
				return {
					title: 'Image',
					message: err.message
				};
			})
		}))
		.pipe(newer(path.public.img))
		//.pipe(debug({title: "imagemin;"}))
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			// use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.public.img))
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: path.public.html
		},
		port: 8080,
		open: true,
		notify: false
	});
	browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

/***********************************************/

gulp.task('watch', function() {
	gulp.watch(path.watch.sass, gulp.series('sass'));
	//gulp.watch(path.watch.scripts, gulp.series('scripts'));
	gulp.watch(path.watch.jade, gulp.series('jade'));
	gulp.watch(path.watch.img, gulp.series('imagemin'));
});

gulp.task('default', gulp.series(
	gulp.parallel('jade', 'assets', 'sass', 'imagemin', 'webpack'),
	gulp.parallel('browserSync', 'watch')
	)
);

gulp.task('build', gulp.series(
	'clean',
	gulp.parallel('imagemin', 'minify-css'))
);
