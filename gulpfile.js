// Directives
const path = {
	src: './src',
	build: './build',
};

const src = {
	blocks: path.src + '/blocks',
	icons: path.src + '/icons',
	js: path.src + '/js',
	pug: path.src + '/pug',
	sass: path.src + '/sass'
};

const build = {
	img: path.build + '/img',
	css: path.build + '/css',
	js: path.build + '/js',
	svg: path.build + '/svg'
};

// Main
const gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	del = require('del');

// CSS
const sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css');

// HTML
const pug = require('gulp-pug');

// JavaScript
const uglify = require('gulp-uglify-es').default,
	babel = require('gulp-babel');

// Images & Icons
const imagemin = require('gulp-imagemin'),
	svg = require('gulp-svg-sprite');

// Tasks
gulp.task('styles', () => {
	return gulp
		.src(src.sass + '/main.sass')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions']
		}))
		.pipe(cleanCSS({
			compatibility: 'ie8',
			format: 'beautify'
		}))
		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream());
})

gulp.task('scripts', () => {
	return gulp
		.src(path.src + '/**/**/*.js')
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(gulp.dest(build.js))
})

gulp.task('markup', () => {
	return gulp
		.src(src.pug + '/**/*.pug')
		.pipe(pug({
			pretty: '\t'
		}))
		.pipe(gulp.dest(path.build))
		.pipe(browserSync.stream())
})

gulp.task('icons', () => {
	return gulp
		.src(src.icons + '/*')
		.pipe(svg({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(gulp.dest(build.svg));
})

gulp.task('images', () => {
	return gulp
		.src([src.blocks + '/**/*.jpeg', src.blocks + '/**/*.jpg', src.blocks + '/**/*.png'])
		.pipe(imagemin())
		.pipe(gulp.dest(build.img))
})

gulp.task('watch', () => {
	browserSync.init({
		server: {
			baseDir: path.build
		}
	});

	gulp.watch(path.src + '/**/**/**/**/*.sass', gulp.parallel('styles'));
	gulp.watch(path.src + '/**/*.js', gulp.parallel('scripts'));
	gulp.watch(path.src + '/**/*.pug', gulp.parallel('markup'));
	gulp.watch(src.icons + '/**/*.svg', gulp.parallel('icons'));
	gulp.watch([src.blocks + '/**/*.jpeg', src.blocks + '/**/*.jpg', src.blocks + '/**/*.png'], gulp.parallel('images'));
	gulp.watch(path.build + '/**/*.html', browserSync.reload);
})

gulp.task('clean', () => {
	return del(path.build + '/*');
})

gulp.task('build', (done) => {
	return gulp
		.series('clean', gulp.parallel('styles', 'scripts', 'markup', 'icons', 'images'))(done);
})