'use strict';

/**
 * Module includes
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require("browser-sync");
var del = require('del');
var runSequence = require('run-sequence');

var reload = browserSync.reload;

/**
 * Global conf
 */
var config = {
	autoprefixerBrowsers: [ // browsers we want to target with the autoprefixer
		'ie >= 10',
		'ie_mob >= 10',
		'ff >= 30',
		'chrome >= 34',
		'safari >= 7',
		'opera >= 23',
		'ios >= 7',
		'android >= 4.4',
		'bb >= 10'
	],
	browserSync: {
		notify: false,
		logPrefix: 'BrowserSync',
		//https: true
		server: {
			baseDir: ['app', '.tmp', 'bower_components'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	}
}

/**
 * Automatically inject saved bower_components into app/index.html
 */
gulp.task('bower', function() {
	var wiredep = require('wiredep').stream;

	gulp.src('app/index.html', {})
		.pipe(wiredep())
		.pipe(gulp.dest('app/'));
});

/**
 * Automatically inject saved files in app/scripts
 */
gulp.task('inject', function() {
	//var target = gulp.src('app/index.html');
	//var sources =

	return gulp.src('./app/index.html')
		.pipe($.inject(gulp.src(['./app/scripts/**/**/*.js'], {read: false}), {relative: true}))
		.pipe(gulp.dest('app'))
		.pipe($.size({title: 'inject'}));
});

/**
 * Compile sass-stylesheets into css-files
 */
gulp.task('styles', function() {

	return gulp.src(['app/styles/main.scss'])
		.pipe($.rubySass({
			style: 'expanded',
			precision: 10
		}))
		.on('error', function(err) {
			console.log(err.message);
		})
		.pipe($.autoprefixer({browsers: config.autoprefixerBrowsers}))
		.pipe(gulp.dest('.tmp/styles'))
		.pipe($.size({title: 'styles'}))
});

/**
 * Lint JavaScript-files
 */
gulp.task('jshint', function() {

	return gulp.src('app/scripts/**/**/*.js')
		.pipe(reload({stream: true, once: true})) // after a file is written, reload the js
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'))
		.pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
		.pipe($.size({title: 'jshint'}));
});

/**
 * Optimize Images
 */
gulp.task('images', function() {

	return gulp.src(['app/images/**/**/*','!app/images/**/*.svg']) // don't optimize svg
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size({title: 'images'}));
});

/**
 * Copy all fonts included in bower_components & app/fonts and remove their relative paths
 */
gulp.task('fonts', function() {
	var fontsSrc = require('main-bower-files')().concat('app/fonts/**/*');

	return gulp.src(fontsSrc)
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'))
		.pipe($.size({title: 'fonts'}));
});

/**
 * Look for assets inside build-blocks and optimize them
 */
gulp.task('html', function() {
	// returns a stream with the concatenated asset files from the build blocks inside the HTML
	var assets = $.useref.assets({searchPath: '{.tmp,app}'});

	return gulp.src('app/**/**/**/*.html')
		.pipe(assets)
		// ngAnnotate angular scripts
		.pipe($.if('**/main.min.js', $.ngAnnotate()))
		// Concatenate And Minify
		.pipe($.if('**/main.min.js', $.uglify({preserveComments: 'some'})))
		.pipe($.if('**/vendor.min.js', $.uglify()))
		.pipe($.if('*.css', $.csso()))
		.pipe(assets.restore()) // brings back the previously filtered out HTML files
		.pipe($.useref())
		.pipe(gulp.dest('dist/'))
});

/**
 * Copy all other files from the /app, that were not copied by the previous tasks
 */
gulp.task('copy', function () {
	return gulp.src([
		'app/*',
		'!app/*.html',
		'app/lib/*'
		], {
			dot: true
		})
		.pipe(gulp.dest('dist'))
		.pipe($.size({title: 'copy'}));
});

/**
 * Remove the .tmp- and dist-folder
 */
gulp.task('clean', function() {

	del(['.tmp', '.sass-cache', 'dist'], function(err) {
		if(err) return console.error(err);
	});

});

////////////////////////////////////////////////////////////////////////////////////////////

/**
 * CLI 'gulp serve': Serve Task.
 * Watches for file changes and reload the browser.
 */
gulp.task('serve', ['styles'], function() {
	// initiate browserSync
	browserSync(config.browserSync);

	// watch for changes in the bower.json
	gulp.watch('bower.json', ['bower', reload]);

	// watch for changes in index.html and module-partials
	gulp.watch(['app/index.html','app/scripts/**/**/*.html'], reload);

	// watch for changes in our sass/scss-files
	gulp.watch(['app/styles/**/*.{scss,sass}'], ['styles', reload]);

	// watch for changes in our angular js-files
	$.watch(['app/scripts/**/**/*.js'], function() {
		runSequence('inject', ['jshint']);
	});

	// watch for images changes
	gulp.watch(['app/images/**/*'], reload);

});

/**
 * CLI 'gulp build': Build Task.
 * Build minified and optimized distribution files.
 */
gulp.task('build', ['clean'], function(cb) {
	runSequence('styles', ['html', 'images', 'fonts', 'copy']);
});

/**
 * CLI 'gulp deploy': Deploy Task.
 * Copies the client/dist to server/assets.
 */
gulp.task('deploy', function(cb) {
	return gulp.src([
		'dist/**/*',
		], {
			dot: true
		})
		.pipe(gulp.dest('../server/assets/'))
		.pipe($.size({title: 'deploy'}));
});