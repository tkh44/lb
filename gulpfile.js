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
	livereload = require('gulp-livereload'),
	del = require('del'),
	plumber = require('gulp-plumber'),
	traceur = require('gulp-traceur'),
	inject = require("gulp-inject"),
	bowerFiles = require('main-bower-files'),
	runSequence = require('run-sequence'),
	es = require('event-stream');

var paths = {
	views: ['public/**/*.html'],
	less: ['public/css/styles.less'],
	es6: ['public/js/**/*.js'],
	scripts: [
		'public/js/app.js',
		'public/js/**/*.js'
	]
};

gulp.task('views', function() {
	return gulp.src(paths.views)
		.pipe(gulp.dest('dist/views'));
});

var scripts = function() {
	return gulp.src(paths.scripts)
		.pipe(traceur({experimental: true}))
		.pipe(gulp.dest('dist/js'));
};

var bowerScripts = function() {
	return gulp.src(bowerFiles({
			filter: /.js/
		}))
		.pipe(concat('bower-files.js'))
		.pipe(gulp.dest('dist/js'));
};


var styles = function() {
	return gulp.src(paths.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(prefix('last 2 Chrome versions', 'last 2 iOS versions', 'last 2 Android versions'))
		.pipe(gulp.dest('dist/css'));
};


gulp.task('ngAnnotate', function() {
	return gulp.src('dist/js/**/*.js')
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
		.pipe(inject(es.merge(bowerScripts()), {name: 'bower'}))
		.pipe(inject(es.merge(scripts(), styles())))
		.pipe(gulp.dest("views"));

});



// Images
gulp.task('images', function() {
	return gulp.src('public/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
	del(['dist'], cb)
});


gulp.task('default', function(cb) {
		runSequence('clean', ['inject'], cb);
	});