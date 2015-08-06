var gulp = require('gulp');
var del = require('del');
try {
  var browserSync = require('browser-sync');
  var reload = browserSync.reload;
} catch (a) {
  console.log("No browserSync");
  var reload = function() {};
};

var gulpLoadPlugins = require('gulp-load-plugins');

var $ = gulpLoadPlugins();

var bower = require('gulp-bower');

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('bower_components/'))
});

gulp.task('allclean', ['clean'], del.bind(null, ['bower_components']));
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('fonts', ['bower'], function() {
    var filterfont = $.filter('**/*.{eot,svg,ttf,woff,woff2}');
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(filterfont)
        //Possibly concat in app fonts here?
        .pipe($.flatten())
        .pipe(gulp.dest('.tmp/fonts')) //for serve
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', ['bower'], function() {
  //favicon, and pictures.
  return gulp.src([
    'app/*.png',
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
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

gulp.task('lint', ['bower'], lint('app/scripts/**/*.js'));

gulp.task('serve', ['bower', 'fonts'], function() {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  //gulp.watch('app/styles/**/*.scss', ['styles']);
  //gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['fonts']);
});


gulp.task('html-v', ['bower'], function() {
  var assets = $.useref.assets({
    noconcat: true,
    searchPath: ['.tmp', 'app', '.']
  });

  var parts = gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.flatten())

   var js = parts
    .pipe($.filter("*.js"))
    .pipe(gulp.dest('dist/raw/js'))
    .pipe($.uglify())
    .pipe(gulp.dest('dist/min/js'))

  return js;

});

gulp.task('html', ['bower'], function() {
  var assets = $.useref.assets({
    searchPath: ['.tmp', 'app', '.']
  });

  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});

  return gulp.src('app/*.html')
    .pipe(assets)
    //filtr js
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore)
    //CSS
    //.pipe(cssFilter)
    //TODO: This isn't "just working" for some reason
    //.pipe($.minifyCss({compatibility: '*'}))
    //.pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    //html
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['bower', 'html', 'fonts', 'extras'], function() {
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
