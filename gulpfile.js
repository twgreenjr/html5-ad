// Banner Meta Data
var config = {
	AdName: 					'My Banner Name',
	AdWidth: 					'300px',
	AdHeight: 					'250px',
	ProjectNumber: 				'0005248'
}

var paths = {
	css: './css/index.scss'
	cssOutput: './output/css'
}

// GULP / PLUGINS
	var gulp 					= require('gulp'),
		sass 					= require('gulp-sass'),
		minifycss 				= require('gulp-minify-css'),
		htmlmin 				= require('gulp-htmlmin'),
		minify 					= require('gulp-minify'),
		replace 				= require('gulp-replace'),
		postcss 				= require('gulp-postcss'),
		autoprefixer 			= require('gulp-autoprefixer'),
		plumber 				= require('gulp-plumber'),
		imagemin 				= require('gulp-imagemin');

// TASKS
	// compile sass
	gulp.task('sass', function() {
	     	gulp.src('./css/index.scss')
	     	.pipe(plumber({errorHandler: onError}))
		    .pipe(replace('AdWidth', config.AdWidth))
		    .pipe(replace('AdHeight', config.AdHeight))
		    .pipe(sass())
		    .pipe( autoprefixer( '> 0%' ) )
	        .pipe(minifycss())
	        .pipe(gulp.dest('./output/css'));
	});

	// compile js

	// compile images
	gulp.task('images', function() {
	     	gulp.src('./images/*.{png,jpg,gif}')
	        .pipe(imagemin())
	        .pipe(gulp.dest('./output/images'));
	});

	// compile html
	gulp.task('html', function() {
	    gulp.src('./index.html')
	    .pipe(replace('AdName', config.AdName))
	    .pipe(replace('AdWidth', config.AdWidth))
	    .pipe(replace('AdHeight', config.AdHeight))
	    .pipe(gulp.dest('output'))
	});
		
	gulp.task('watch', function() {
	    gulp.watch('css/*.scss', ['sass']);
	    gulp.watch('index.html', ['html']);
	})

	gulp.task('default', ['watch']);
	
	//build banner preview
	gulp.task('build', ['html','sass','images']);


// ERROR handling
var onError = function(err) {
	console.log(err);
}