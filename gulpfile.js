var gulp = require('gulp');
var del = require('del');
var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

var bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('bower_components/'))
});

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
};

gulp.task('allclean', ['clean'], del.bind(null, ['bower_components']));

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
gulp.task('lint', lint('app/scripts/**/*.js'));

gulp.task('html', ['bower'], function() {
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

gulp.task('test', ['build'], function() {
  //TODO: Guess I should do something here - but hey, it at least requires
  //a build to pass!
  return;
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});