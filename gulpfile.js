
let project_folder = "dist";
let source_folder = "src";

let path = {
   build: {
      html: project_folder + "/",
      css: project_folder + "/css/",
      js: project_folder + "/js/",
      img: project_folder + "/img/",
      fonts: project_folder + "/fonts/",
      favicon: project_folder + "/"
   },
   src: {
      html: [source_folder + "/templates/**/*.njk"],
      css: source_folder + "/scss/style.scss",
      js: source_folder + "/js/script.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: source_folder + "/fonts/*.ttf",
      favicon: source_folder + "/favicon/**",
      templatesRoot: source_folder + "/templates/"
   },
   watch: {
      html: source_folder + "/templates/**/*.njk",
      css: source_folder + "/scss/**/*.scss",
      js: source_folder + "/js/**/*.js",
      img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
      fonts: source_folder + "/fonts/*.ttf",
      favicon: source_folder + "/favicon/**"
   },
   clean: "./" + project_folder + "/"
}

let { src, dest } = require('gulp'),
   gulp = require('gulp'),
   browsersync = require("browser-sync").create(),
   fileinclude = require("gulp-file-include"),
   del = require("del"),
   scss = require("gulp-sass")(require("sass")),
   autoprefixer = require("gulp-autoprefixer"),
   group_media = require("gulp-group-css-media-queries"),
   clean_css = require("gulp-clean-css"),
   rename = require("gulp-rename"),
   uglify = require("gulp-uglify-es").default,
   babel = require('gulp-babel'),
   imagemin = require("gulp-imagemin"),
   nunjucks = require("gulp-nunjucks-render");

function browserSync() {
   browsersync.init({
      server: {
         baseDir: "./" + project_folder + "/"
      },
      port: 3000,
      notify: false
   })
}

function html() {
   return src(path.src.html)
      // .pipe(fileinclude())
      .pipe(nunjucks({
         path: [path.src.templatesRoot]
      }))
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function css() {
   return src(path.src.css)
      .pipe(
         scss({ outputStyle: "expanded" }).on('error', scss.logError)
      )
      .pipe(
         group_media()
      )
      .pipe(
         autoprefixer({
            overrideBrowserlist: ["last 5 version"],
            cascade: true
         })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
         rename({
            extname: ".min.css"
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

function js() {
   return src(path.src.js)
      .pipe(fileinclude())
      .pipe(babel({
         presets: ['@babel/env']
      }))
      .pipe(dest(path.build.js))
      .pipe(
         uglify()
      )
      .pipe(
         rename({
            extname: ".min.js"
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function images() {
   console.log(imagemin);
   return src(path.src.img)
      .pipe(
         imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.svgo({
               plugins: [
                  { removeViewBox: false },
                  { cleanupIDs: false }
               ]
            })
         ])
      )
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}

function favicon() {
   return src(path.src.favicon)
      .pipe(dest(path.build.favicon))
}

function watchFiles() {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.img], images);
   gulp.watch([path.watch.favicon], favicon);
}

function clean() {
   return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, favicon));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;