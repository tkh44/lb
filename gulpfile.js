var gulp = require('gulp'),
	less = require('gulp-less'),
	prefix = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	del = require('del'),
	plumber = require('gulp-plumber'),
	to5 = require('gulp-6to5'),
	inject = require("gulp-inject"),
	bowerFiles = require('main-bower-files'),
	runSequence = require('run-sequence'),
	es = require('event-stream'),
	livereload = require('gulp-livereload'),
	sourcemaps = require('gulp-sourcemaps');

var path = require('path');

var paths = {
	less: ['public/css/styles.less'],
	fonts: ['public/fonts/**'],
	es6: ['app/**/*.js'],
	scripts: [
		'app/app.js',
		'app/**/*.js'
	],
	views: ['app/**/*.html'],
	dist: {
		styles: ['!dist/bower/**/*.css', 'dist/**/*.css'],
		js: ['!dist/bower/**/*.js', 'dist/**/*.js']
	}
};

function extname (file) {
	return path.extname(file).slice(1);
}

function transform(filepath, file, i, length) {
	var filepath =  filepath.split('dist')[1];
	switch(extname(filepath)) {
		case 'css':
			return '<link rel="stylesheet" href="' + filepath + '">';
		case 'js':
			return '<script src="' + filepath + '"></script>';
	}
}


gulp.task('views', function() {
	return gulp.src(paths.views)
		.pipe(gulp.dest('dist/views'));
});

gulp.task('fonts', function() {
	return gulp.src(paths.fonts)
		.pipe(gulp.dest('dist/fonts'));
});

var bowerScripts = function() {
	return gulp.src(bowerFiles({
			filter: /.js/
		}))
		//.pipe(concat('bower-files.js'))
		.pipe(gulp.dest('dist/bower'));
};

gulp.task('scripts', function() {
	return gulp.src(paths.scripts)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(to5())
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	return gulp.src(paths.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix('last 2 Chrome versions', 'last 2 iOS versions', 'last 2 Android versions'))
		.pipe(gulp.dest('dist/css'));
});

gulp.task('views', function() {
	return gulp.src(paths.views)
		.pipe(gulp.dest('dist'));
});


gulp.task('ngAnnotate', function() {
	return gulp.src('app/**/*.js')
		.pipe(plumber())
		.pipe(ngAnnotate({
			remove: true,
			add: true,
			single_quotes: true
		}))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('inject', function() {
	return gulp.src('views/index.html')
		.pipe(plumber())
		.pipe(inject(es.merge(bowerScripts()), {
			name: 'bower',
			transform: transform
		}))
		.pipe(inject(es.merge(
			gulp.src(paths.dist.styles),
			gulp.src(paths.dist.js)
		), {
			transform: transform
		}))
		.pipe(gulp.dest("dist"));
});


// Images
gulp.task('images', function() {
	return gulp.src('public/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'))
		//.pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
	del(['dist'], cb)
});

gulp.task('watch', function() {
	// Create LiveReload server
	livereload.listen();

	//gulp.watch(['dist/index.html'], ['inject']);
	//gulp.watch(paths.dist.css, ['inject']);
	//gulp.watch(paths.dist.js, ['inject']);
	gulp.watch(paths.less, ['styles']);
	gulp.watch(paths.views, ['views']);
	gulp.watch(paths.scripts, ['scripts']);

	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);
});

gulp.task('default', function(cb) {
		runSequence('clean',['scripts', 'styles', 'views', 'fonts', 'images'], ['inject'], 'watch', cb);
	});

