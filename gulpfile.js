const gulp = require("gulp"),
  concat = require("gulp-concat"),
  clean = require("gulp-clean"),
  sass = require("gulp-sass"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  { series } = require("gulp");
sass.compiler = require("node-sass");

function dist(callback) {
  callback();
}

function cleanDist() {
  return gulp.src("./dist/*", { read: false }).pipe(clean());
}

function copyDist() {
  gulp.src("./source/index.html").pipe(gulp.dest("./dist/"));
  gulp.src("./source/index-embed.html").pipe(gulp.dest("./dist/"));
  gulp.src("./source/embed.html").pipe(gulp.dest("./dist/"));
  gulp.src("./source/map.html").pipe(gulp.dest("./dist/"));
  //gulp.src("./source/vendor/lib/*").pipe(gulp.dest("./dist/js"));
  //gulp.src("./source/vendor/css/*").pipe(gulp.dest("./dist/css"));
  //gulp.src("./source/js/*").pipe(gulp.dest("./dist/js"));
  gulp.src("./source/img/*").pipe(gulp.dest("./dist/img"));
  gulp.src("./source/states/*").pipe(gulp.dest("./dist/states"));
  gulp.src("./source/schemas/*").pipe(gulp.dest("./dist/schemas"));
  gulp.src("./source/docs/*").pipe(gulp.dest("./dist/docs"));
  gulp.src("./source/fonts/*").pipe(gulp.dest("./dist/fonts"));
  gulp.src("./source/states").pipe(gulp.dest("./dist/states"));
  gulp.src("./source/vendor/lib/jquery.js").pipe(gulp.dest("./dist/js"));
  gulp.src("./source/css/app-variables.css").pipe(concat("lam-variables.css")).pipe(gulp.dest("./dist/css"));
  gulp.src("./source/templates/*").pipe(gulp.dest("./dist/templates"));
  gulp.src("./source/docs/*").pipe(gulp.dest("./dist/docs"));
  return gulp.src("./source/templates").pipe(gulp.dest("./dist/templates/"));
}

function combineAppJs() {
  return (
    gulp
      .src([
        "./source/js/app-map-enums.js",
        "./source/js/app-map-styles.js",
        "./source/js/app-map-vector.js",
        "./source/js/app-map-tooltip.js",
        "./source/js/app-map-info.js",
        "./source/js/app-map.js",
        "./source/js/draw-tools.js",
        "./source/js/map-tools.js",
        "./source/js/print-tools.js",
        "./source/js/search-tools.js",
        "./source/js/select-tools.js",
        "./source/js/links-tools.js",
        "./source/js/legend-tools.js",
        "./source/js/download-tools.js",
        "./source/js/share-tools.js",
        "./source/js/app-dispatcher.js",
        "./source/js/app-resources.js",
        "./source/js/app-cookie-consent.js",
        "./source/js/app-cookie-description.js",
        "./source/js/app-custom.js",
        "./source/js/app-relations.js",
        "./source/js/app-dom.js",
        "./source/js/app-loader.js",
        "./source/js/app-requests.js",
        "./source/js/app-store.js",
        "./source/js/app-layer-tree.js",
        "./source/js/app-templates.js",
        "./source/js/app-toolbar.js",
        "./source/js/app.js",
      ])
      .pipe(concat("lam.js"))
      //.pipe(uglify())
      .pipe(gulp.dest("./dist/js"))
  );
}

function combineCss() {
  return gulp
    .src([
      "./source/css/app-buttons.css",
      "./source/css/app-components.css",
      "./source/css/app-elements.css",
      "./source/css/app-grid.css",
      "./source/css/app-helpers.css",
      "./source/css/app-info-window.css",
      "./source/css/app-layer-tree.css",
      "./source/css/app-panel.css",
      "./source/css/app-shadows.css",
      "./source/css/app-tooltip.css",
      "./source/css/app-typography.css",
      "./source/css/app-cookie-consent.css",
      "./source/css/app-cookie-description.css",
      "./source/css/app-vendor.css",
      "./source/vendor/css/ol.css",
    ])
    .pipe(cleanCSS())
    .pipe(concat("lam.css"))
    .pipe(gulp.dest("./dist/css"));
}

function combineLibs() {
  return gulp
    .src([
      "./source/vendor/lib/handlebars.min.js",
      "./source/vendor/lib/clipboard.min.js",
      "./source/vendor/lib/microevent.js",
      "./source/vendor/lib/labelpoint.js",
      "./source/vendor/lib/proj4.js",
      "./source/vendor/lib/ol.js",
    ])
    .pipe(concat("lam-libs.js"))
    .pipe(gulp.dest("./dist/js"));
}

function watchScripts(cb) {
  gulp.watch(["./source/**/*"], function (cb) {
    combineAppJs();
    combineCss();
    combineLibs();
    copyDist();
    cb();
  });
}

function renderSass() {
  return gulp
    .src(["./node_modules/materialize-css/sass/materialize.scss"])
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./source/vendor/css/", { overwrite: true }));
}

exports.default = dist;
exports.clean = cleanDist;
exports.copy = copyDist;
exports.scripts = series(combineAppJs, combineCss, combineLibs, copyDist);
exports.watch = watchScripts;
exports.sass = renderSass;
