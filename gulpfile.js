'use strict';
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps');

    gulp.task("hello", () =>{
        console.log("Hello");
    });
    
    gulp.task("default", ["hello"], ()=>{
        console.log("This is a default task");
    });
    
    gulp.task("compileSass", ()=>{
        gulp.src("public/scss/style.scss")
            .pipe(maps.init())
            .pipe(sass())
            .pipe(maps.write('./'))
            .pipe(gulp.dest('public/css'));
    });