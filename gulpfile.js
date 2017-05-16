var gulp = require('gulp'),
	sass = require('gulp-sass'),
	compass = require('gulp-compass'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),  //深度压缩图片
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	cleancss = require('gulp-clean-css'),  //使用gulp-minify-css压缩css文件，减小文件大小
	cssver = require('gulp-make-css-url-version'),  //css引用的图片加上md5值
 	del = require('del'),
 	autoPrefixer = require('gulp-autoprefixer'),  //私有前缀
 	htmlmin = require('gulp-htmlmin');
 	//browserify = require('browserify');

var paths = {
	sass : ['src/sass/**/*.scss','!src/sass/_*.scss'],
	htmlmin : 'src/page/*.html',
	images : 'src/images/**/*.{png,jpg,gif,ico}',
	scripts : ['src/js/**/*.js','!src/js/**/*.min.js'],
	copyjs : ['src/js/**/*.min.js']
};

gulp.task('clean', function(){
	return del(['css','htmlmin','js','copyjs','img']);
});

gulp.task('css', ['clean'], function(){
	var opts = {
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        };
	return gulp.src(paths.sass)
			   .pipe(sass())
			   .pipe(cssver(opts))
			   .pipe(autoPrefixer({
		            browsers: ['last 2 versions', 'Android >= 4.0'],
		            cascade: true, //是否美化属性值 默认：true 像这样：
		            remove:false //是否去掉不必要的前缀 默认：true
		        }))
			   .pipe(cleancss())
			   .pipe(gulp.dest('dist/css'));
});

gulp.task('htmlmin', ['clean'], function(){
	var option = {
		removeComments : true, //清除HTML注释
		collapseWhitespace : true, //压缩html
		collapseBooleanAttributes : true, //省略布尔属性的值
		removeEmptyAttributes : true,  //删除所有空格作属性值
		removeScriptTypeAttributes : true, // 删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes : true,  //删除<style>和<link>的type="type/css"
		minifyJS : true,  //压缩页面js
		minifyCSS : true  //压缩页面css
	};
	return gulp.src(paths.htmlmin)
		.pipe(htmlmin(option))
		.pipe(gulp.dest('dist/html'));
});

//指定文件js压缩然后生成新的
gulp.task('js',['clean'], function(){
	return gulp.src(paths.scripts)
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));
});

//指定文件不压缩只是复制比如第三方插件
gulp.task('copyjs',['clean'], function(){
	return gulp.src(paths.copyjs)
	.pipe(gulp.dest('dist/js'));
});

gulp.task('img',['clean'], function(){
	var opts = {
		optimizationLevel : 5,  //类型：Number  默认：3  取值范围：0-7（优化等级）
		progressive : true,  //类型：Boolean 默认：false 无损压缩jpg图片
		interlaced : true,  //类型：Boolean 默认：false 隔行扫描gif进行渲染
		multipass : true,   //类型：Boolean 默认：false 多次优化svg直到完全优化

		svgoPlugins : [{removeViewBox : false}],  //不要移除svg的viewbox属性
		use : [pngquant()]  //使用pngquant深度压缩png图片的imagemin插件

	};

	return gulp.src(paths.images)
		.pipe(imagemin(opts))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('watch', function(){
	gulp.watch(paths.sass,['css']);
	gulp.watch(paths.htmlmin,['htmlmin']);
	gulp.watch(paths.images,['img']);
	gulp.watch(paths.scripts,['js']);
	gulp.watch(paths.copyjs,['js']);

});

gulp.task('default',['watch','css','htmlmin','img','js','copyjs']);

