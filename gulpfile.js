const gulp = require("gulp"),
  concat = require("gulp-concat"),
  clean = require("gulp-clean");

function dist(callback) {
  callback();
}

function cleanDist() {
  return gulp.src("./dist/*", { read: false }).pipe(clean());
}

function copyDist() {
  gulp.src("./source/index.html").pipe(gulp.dest("./dist/"));
  gulp.src("./source/vendor/lib/*").pipe(gulp.dest("./dist/js"));
  gulp.src("./source/vendor/css/*").pipe(gulp.dest("./dist/css"));
  //gulp.src("./source/js/*").pipe(gulp.dest("./dist/js"));
  gulp.src("./source/img/*").pipe(gulp.dest("./dist/img"));
  gulp.src("./source/states/*").pipe(gulp.dest("./dist/states"));
  gulp.src("./source/schemas/*").pipe(gulp.dest("./dist/schemas"));
  gulp.src("./source/templates/*").pipe(gulp.dest("./dist/templates"));
  gulp.src("./source/fonts/*").pipe(gulp.dest("./dist/fonts"));
  gulp.src("./source/states").pipe(gulp.dest("./dist/states"));
  return gulp.src("./source/templates").pipe(gulp.dest("./dist/templates/"));
}

function combineScripts() {
  gulp
    .src([
      "./source/js/app-dispatcher.js",
      "./source/js/app-resources.js",
      "./source/js/app-custom.js",
      "./source/js/app-store.js",
      "./source/js/app-layer-tree.js",
      "./source/js/app-templates.js",
		"./source/js/app-toolbar.js",
      "./source/js/app.js"
    ])
    .pipe(concat("app.js"))
    //.pipe(uglify(uglifyOptions))
    .pipe(gulp.dest("./dist/js"));
  gulp
    .src([
      "./source/js/draw-tools.js",
      "./source/js/map-tools.js",
      "./source/js/print-tools.js",
      "./source/js/search-tools.js",
      "./source/js/select-tools.js",
      "./source/js/share-tools.js"
    ])
    .pipe(concat("app-tools.js"))
    .pipe(gulp.dest("./dist/js"));
	
	gulp
    .src([
	  "./source/css/app-variables.css",
      "./source/css/app-layout.css",
	  "./source/css/app-tooltip.css",
	  "./source/css/app-buttons.css",
      "./source/css/app.css"
    ])
    .pipe(concat("app.css"))
    .pipe(gulp.dest("./dist/css"));
	
  return gulp
    .src([
	  "./source/js/app-map-enums.js",
      "./source/js/app-map-styles.js",
      "./source/js/app-map-vector.js",
      "./source/js/app-map-tooltip.js",
      "./source/js/app-map-info.js",
      "./source/js/app-map.js"
    ])
    .pipe(concat("app-map.js"))
    .pipe(gulp.dest("./dist/js"));
}

function watchScripts(cb) {
  gulp.watch(["./source/**/*"], function(cb) {
	copyDist();
    combineScripts();
    cb();
  });
}

exports.default = dist;
exports.clean = cleanDist;
exports.copy = copyDist;
exports.scripts = combineScripts;
exports.watch = watchScripts;
