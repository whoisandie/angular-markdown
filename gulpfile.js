var gulp = require('gulp'),
  karma = require('karma').server,
  plugins = require('gulp-load-plugins')();

gulp.task('jshint', function(){
  return gulp.src(['src/angular-markdown.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('annotate', ['jshint'], function(){
  return gulp.src(['src/angular-markdown.js'])
    .pipe(plugins.ngAnnotate({
      add: true,
      remove: true,
      single_quotes: true
    }))
    .pipe(plugins.wrapper({
      header: '(function(){\n"use strict";\n',
      footer: '\n})();'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat', function(){
  return gulp.src([
    'src/scripts/codemirror/codemirror.js',
    'src/scripts/codemirror/continuelist.js',
    'src/scripts/codemirror/xml.js',
    'src/scripts/codemirror/markdown.js',
    'src/scripts/editor.js',
    'src/scripts/angular-markdown.js'
  ])
    .pipe(plugins.concat('angular-markdown.js'))
    .pipe(plugins.wrapper({
      header: '(function(){\n',
      footer: '\n})();'
    }))
    .pipe(gulp.dest('demo/js'));
});

gulp.task('karma', function(done){
  return karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('watch', function(){
  gulp.watch([
    'src/scripts/codemirror/continuelist.js',
    'src/scripts/codemirror/markdown.js',
    'src/scripts/editor.js'
  ], ['concat']);
  gulp.watch('src/angular-markdown.js', ['annotate', 'concat']);
});

gulp.task('default', ['concat', 'watch']);
gulp.task('test', ['karma']);