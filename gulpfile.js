var gulp = require('gulp'),
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
      header: '(function(global){\n"use strict";\n',
      footer: '\nglobal.Editor = Editor\n})(this);'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('concat', function(){
  return gulp.src([
      'src/codemirror.js',
      'src/continuelist.js',
      'src/xml.js',
      'src/markdown.js',
      'src/editor.js',
      'src/angular-markdown.js'
    ])
    .pipe(plugins.concat('angular-markdown.js'))
    .pipe(plugins.wrapper({
      header: '(function(){\n',
      footer: '\n})();'
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
  gulp.watch(['src/codemirror.js', 'src/continuelist.js', 'src/xml.js', 'src/markdown.js', 'src/editor.js',], ['concat']);
  gulp.watch('src/angular-markdown.js', ['annotate', 'concat']);
});

gulp.task('default', ['concat', 'watch']);