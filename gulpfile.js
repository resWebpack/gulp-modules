'use strict'

var gulp            = require('gulp');
var minifycss       = require('gulp-minify-css');
var uglify          = require('gulp-uglify');
var webpack         = require('webpack');
var rename          = require('gulp-rename');
var del             = require('del');
var browserSync     = require('browser-sync').create(); // 实时刷新
var reload          = browserSync.reload;               // reload方法
var webpackConfig   = require('./webpack.config.js');
var config          = require('./config.js');
var imgmin          = require('gulp-imagemin');         // 图片压缩
var sass            = require('gulp-sass');             // sass编译
var cleanCSS        = require('gulp-clean-css');        // 压缩css
var header          = require('gulp-header');           // header
var htmlmin         = require('gulp-htmlmin');          // html压缩
var shell           = require('gulp-shell');
var DevMiddleware   = require("webpack-dev-middleware");




/** banner配置 **/
var time = new Date();
var timeStamp = dateToString(time);
var banner_html = ['<!--',' * @name <%= pkg.name %>',' * @description <%= pkg.description %>',' * @version v<%= pkg.version %>',' * @timeStamp '+ timeStamp, ' -->',''].join('\n');
var banner_js = ['/**',' * @name <%= pkg.name %>',' * @description <%= pkg.description %>',' * @version v<%= pkg.version %>',' * @timeStamp '+ timeStamp, ' **/',''].join('\n');
function dateToString(time) {
    var year = time.getYear() + 1900;
    var month = time.getMonth() + 1;  //月  
    var day = time.getDate();         //日  
    var hh = time.getHours();       //时  
    var mm = time.getMinutes();    //分  
    var str= year + "-";
    if(month < 10){
        str += "0";     
    }
    str += month + "-";  
    if(day < 10)  
        str += "0";  
    str += day + " ";
    str += hh + ':';
    str += mm;
    return(str);   
}

/** 
 *  服务器配
 */
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: config.server.baseDir,
        },
        port: config.server.port,
    });
});


/** 
 *  清理生产目录文件
 *  当clean执行完成时，调用cb(),此时运行webpack task
 */
gulp.task('clean', function(cb) {
    del(['./dist/**']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});


/** 
 *  执行webpack打包
 */
gulp.task('webpack', ['clean'], function(cb) {
    webpack(webpackConfig,cb);
});
gulp.task('webpack-noclean', function(cb) {
    DevMiddleware(webpack(webpackConfig,cb), {

    })
});



gulp.task('main',['webpack-noclean'], function() {
     return gulp.src('./dist/*.js')
            .pipe(gulp.dest('./dist'))
            .pipe(reload({stream: true}));
});

/** 
 *  处理sass文件
 */ 
gulp.task('sass', function () {
    return gulp.src('./src/css/*.sass')
                // 编译sass
                .pipe(sass())
               
                // 压缩css
                .pipe(cleanCSS())
               
                // 重命名
                .pipe(header(banner_js,{ pkg : config.basicInfo }))
                .pipe(gulp.dest('./dist'))
                .pipe(reload({stream: true}));
});


/** 
 *  处理html文件
 */ 
gulp.task('html', function(){
    return gulp.src('./src/*.html')

    //压缩
    .pipe(htmlmin({
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS

    }))
    .pipe(header(banner_html,{ pkg : config.basicInfo }))
    .pipe(gulp.dest('./dist'))
    .pipe(reload({stream: true}));
});


/** 
 *  处理其他类文件
 */

// libs
gulp.task('libs',function(){
    gulp.src(['./dist/libs/*'])
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(reload({stream: true}));
});

// 图片
gulp.task('img', function(){
    return gulp.src('./src/img/*')
                .pipe(imgmin())
                .pipe(gulp.dest('./dist'))
                .pipe(reload({stream: true}));
});



// 等webpack执行完以后，再执行pre-dev 
gulp.task('pre-dev', ['webpack'], function () {
   return gulp.start('libs','img','sass','html'); 
});

gulp.task('dev', ['pre-dev'], function () {  
    gulp.start('server'); 
    gulp.watch(['./src/*.js', './src/js/*.js'], ['main']);
    gulp.watch('./src/libs/*', ['libs']);
    gulp.watch('./src/img/*', ['img']);
    gulp.watch('./src/*.html', ['html']);
    gulp.watch('./src/css/*', ['sass']);
});

gulp.task('prod', ['webpack'], function(){
    return gulp.start('libs','img','sass','html'); 
});