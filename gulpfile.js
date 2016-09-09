var gulp 					= require('gulp'),
	uglify 					= require('gulp-uglify'),
	htmlmin					= require('gulp-htmlmin')
	sass					= require('gulp-sass')

	//autoprefixer			= require('gulp-autoprefixer'),

// ALL TASKS
	
	// JS TASK
	gulp.task('js', function(arg){
		gulp.src('dev/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./output/js'));
	});

	// HTML TASK
	gulp.task('html', function(arg) {
		gulp.src('dev/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./output'));
	});

	// CSS TASK
	gulp.task('scss', function(arg) {
        sass('dev/scss/*.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('./output/css'))
    });

	// WATCH
	gulp.task('watch', function(arg){
		gulp.watch('dev/js/*.js', ['js'] )
	});


	// default task
	gulp.task('default', ['js','html','scss','watch']);


