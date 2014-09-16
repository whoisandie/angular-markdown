var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

gulp.task('jshint', function(){
  return gulp.src(['src/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('annotate', ['jshint'], function(){
  return gulp.src(['src/*.js'])
    .pipe(plugins.ngAnnotate({
      add: true,
      remove: true,
      single_quotes: true
    }))
    .pipe(plugins.wrapper({
      header: '(function(){\n',
      footer: '\n})();'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch('src/*.js', ['annotate']);
});

gulp.task('default', ['watch']);