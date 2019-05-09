const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const header = require("gulp-header");
const pkg = require("./package.json");
const connect = require("gulp-connect");

const banner = [
  "/*! ",
  "<%= package.name %> ",
  "v<%= package.version %> | ",
  "(c) " + new Date().getFullYear() + " <%= package.author %> |",
  " <%= package.homepage %>",
  " */",
  "\n"
].join("");

gulp.task("js", () => {
  return gulp
    .src("src/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("poster.js"))
    .pipe(
      header(banner, {
        package: pkg
      })
    )
    .pipe(gulp.dest("dist/"))
    .pipe(uglify())
    .pipe(concat("poster.min.js"))
    .pipe(
      header(banner, {
        package: pkg
      })
    )
    .pipe(gulp.dest("dist/"));
});

gulp.task("server", function() {
  connect.server({
    port: 8080,
  });
});

gulp.watch("src/**/*.js", function(e) {
  gulp.start("js");
});

gulp.task("default", ["js", 'server']);
