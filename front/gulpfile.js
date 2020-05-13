let gulp = require("gulp");
let cssnano = require("gulp-cssnano");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify");
let concat = require("gulp-concat");
let cache = require("gulp-cache");
let imagemin = require("gulp-imagemin");
let bs = require("browser-sync").create();
let sass = require("gulp-sass-china");
let util = require("gulp-util");
let sourcemaps = require("gulp-sourcemaps");
var jsImport = require('gulp-js-import');


//先把所有的路径存储起来
var path = {
    'html':'./templates/**/',
    'css':'./src/css/**/',
    'js':'./src/js/',
    'images':'./src/images/**/',
    'css_dist':'./dist/css/',
    'js_dist':'./dist/js/',
    'images_dist':'./dist/images/',
};
//处理html文件的任务
gulp.task("html",function () {
    gulp.src(path.html +'*.html')
        .pipe(bs.stream())
});
//定义一个css任务
gulp.task("css", function () {
    gulp.src(path.css + "*.scss")
        // 两种形式都可以，第一种会打印记录
        .pipe(sass().on("error",util.log))
        // .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({"suffix": ".min"}))
        .pipe(gulp.dest(path.css_dist))
        .pipe(bs.stream());
});

gulp.task('import', function() {
  return gulp.src(path.js + "*.js")
        .pipe(jsImport({hideConsole: true}))
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream());
});
//定义一个js任务
gulp.task("js",function () {
    gulp.src(path.js + "*.js")
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({"suffix": ".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream());
});
//定义一个图片任务
gulp.task("images" ,function () {
    gulp.src(path.images + "*.*")
        // .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream());
});

//定义一个监听任务
gulp.task("watch", function () {
    gulp.watch(path.css+"*.scss",["css"]);
    gulp.watch(path.js+"*.js",["js"]);
    gulp.watch(path.images+"*.*",["images"]);
    gulp.watch(path.html+"*.html*",["html"]);
    // gulp.watch(path.js+"*.js",["js"]);
});
//创建一个服务器,初始化一个browser-sync的任务
gulp.task("bs", function () {
    bs.init({
        'server':{
            'baserDir':"./"
        },
        'open':false
    });
});

//创建一个默认的任务
// gulp.task("default", ['bs','watch']);
// 这里不能写['bs','watch'] 因为版本更新，4.0当中不能这么写
// gulp.task("default", ['bs','watch']);
gulp.task("default",['watch']);
