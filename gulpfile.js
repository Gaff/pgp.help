var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}


gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('lint', lint('app/scripts/**/*.js'));

gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    //.pipe($.if('*.js', $.uglify()))
    //.pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
    .pipe(assets.restore())
    .pipe($.useref())
    //.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});


gulp.task('build', ['html'], function() {
  //dump some size info
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
