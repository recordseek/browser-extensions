// +--------------+
// | Dependencies |
// +--------------+

var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var rseq = require('run-sequence');
var zip = require('gulp-zip');
var replace = require('gulp-token-replace');
var ignore = require('gulp-ignore');
var rename = require('gulp-rename');
var jsonpatch = require('jsonpatch');
var args = require('yargs').argv;
var watch = require('gulp-watch');

// +------------------------+
// | Command Line Arguments |
// +------------------------+

var config = require('./src/config/config.json');
var environment = 'Local';
if (args.env && (args.env === 'Development' || args.env === 'QA' || args.env === 'Stage' || args.env === 'Production')) {
    config = jsonpatch.apply_patch(config, require('./src/config/config.patch-' + args.env + '.json'));
    environment = args.env;
}

// +------------------+
// | Helper Functions |
// +------------------+

function pipe(src, transforms, dest) {
    if (typeof transforms === 'string') {
        dest = transforms;
        transforms = null;
    }

    var stream = gulp.src(src);
    transforms && transforms.forEach(function (transform) {
        stream = stream.pipe(transform);
    });

    if (dest) {
        stream = stream.pipe(gulp.dest(dest));
    }

    return stream;
}

// +------------+
// | Meta Tasks |
// +------------+

gulp.task('default', function (cb) {
    return rseq(['clean'], ['build'], ['config'], ['store'], ['dist'], cb);
});

gulp.task('watch', function () {
    gulp.watch('./src/**', ['default']);
});

gulp.task('chrome', function (cb) {
    return rseq(['chrome-clean'], ['chrome-build'], ['chrome-config'], ['chrome-store'], ['chrome-dist'], cb);
});

gulp.task('edge', function (cb) {
    return rseq(['edge-clean'], ['edge-build'], ['edge-config'], ['edge-store'], ['edge-dist'], cb);
});

gulp.task('firefox', function (cb) {
    return rseq(['firefox-clean'], ['firefox-build'], ['firefox-config'], ['firefox-store'], ['firefox-dist'], cb);
});

gulp.task('opera', function (cb) {
    return rseq(['opera-clean'], ['opera-build'], ['opera-config'], ['opera-store'], ['opera-dist'], cb);
});

gulp.task('safari', function (cb) {
    return rseq(['safari-clean'], ['safari-build'], ['safari-config'], ['safari-store'], ['safari-dist'], cb);
});

gulp.task('vivaldi', function (cb) {
    return rseq(['vivaldi-clean'], ['vivaldi-build'], ['vivaldi-config'], ['vivaldi-store'], ['vivaldi-dist'], cb);
});

gulp.task('yandex', function (cb) {
    return rseq(['yandex-clean'], ['yandex-build'], ['yandex-config'], ['yandex-store'], ['yandex-dist'], cb);
});

// +-----------------------+
// | Task - Step 1 - Clean |
// +-----------------------+

gulp.task('clean', function (cb) {
    return rseq(['chrome-clean', 'edge-clean', 'firefox-clean', 'opera-clean', 'safari-clean', 'vivaldi-clean', 'yandex-clean'], cb);
});

gulp.task('chrome-clean', function (cb) {
    return del(['./tmp/tm/chrome/**/*', './tmp/dev/chrome/**/*', './tmp/dist/chrome/**/*'], cb);
});

gulp.task('edge-clean', function (cb) {
    return del(['./tmp/build/edge/**/*', './tmp/dev/edge/**/*', './tmp/dist/edge/**/*'], cb);
});

gulp.task('firefox-clean', function (cb) {
    return del(['./tmp/build/firefox/**/*', './tmp/dev/firefox/**/*', './tmp/dist/firefox/**/*'], cb);
});

gulp.task('opera-clean', function (cb) {
    return del(['./tmp/build/opera/**/*', './tmp/dev/opera/**/*', './tmp/dist/opera/**/*'], cb);
});

gulp.task('safari-clean', function (cb) {
    return del(['./tmp/build/safari/**/*', './tmp/dev/safari/**/*', './tmp/dist/safari/**/*'], cb);
});

gulp.task('vivaldi-clean', function (cb) {
    return del(['./tmp/build/vivaldi/**/*', './tmp/dev/vivaldi/**/*', './tmp/dist/vivaldi/**/*'], cb);
});

gulp.task('yandex-clean', function (cb) {
    return del(['./tmp/build/yandex/**/*', './tmp/dev/yandex/**/*', './tmp/dist/yandex/**/*'], cb);
});

// +-----------------------+
// | Task - Step 2 - Build |
// +-----------------------+

gulp.task('build', function (cb) {
    return rseq(['chrome-build', 'edge-build', 'firefox-build', 'opera-build', 'safari-build', 'vivaldi-build', 'yandex-build'], cb);
});

gulp.task('chrome-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/chrome/lib'),
        pipe('./src/img/**/*', './tmp/build/chrome/img'),
        pipe('./src/js/**/*', './tmp/build/chrome/js'),
        pipe('./src/html/**/*', './tmp/build/chrome/html'),
        pipe('./src/vendor/chrome/browser.js', './tmp/build/chrome/js'),
        pipe('./src/vendor/chrome/background.js', './tmp/build/chrome/js'),
        pipe('./src/vendor/chrome/options.js', './tmp/build/chrome/js'),
        pipe('./src/vendor/chrome/options.html', './tmp/build/chrome/html'),
        pipe('./src/vendor/chrome/manifest.json', './tmp/build/chrome'),
        pipe('./src/_locales/en/messages.json', './tmp/build/chrome/_locales/en')
    );
});

gulp.task('edge-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/edge/lib'),
        pipe('./src/img/**/*', './tmp/build/edge/img'),
        pipe('./src/js/**/*', './tmp/build/edge/js'),
        pipe('./src/html/**/*', './tmp/build/edge/html'),
        pipe('./src/vendor/edge/browser.js', './tmp/build/edge/js'),
        pipe('./src/vendor/edge/background.js', './tmp/build/edge/js'),
        pipe('./src/vendor/edge/manifest.json', './tmp/build/edge'),
        pipe('./src/vendor/edge/options.js', './tmp/build/edge/js'),
        pipe('./src/_locales/en/messages.json', './tmp/build/edge/_locales/en')
    );
});

gulp.task('firefox-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/firefox/lib'),
        pipe('./src/img/**/*', './tmp/build/firefox/img'),
        pipe('./src/js/**/*', './tmp/build/firefox/js'),
        pipe('./src/html/**/*', './tmp/build/firefox/html'),
        pipe('./src/vendor/firefox/browser.js', './tmp/build/firefox/js'),
        pipe('./src/vendor/firefox/background.js', './tmp/build/firefox/js'),
        pipe('./src/vendor/firefox/manifest.json', './tmp/build/firefox'),
        pipe('./src/_locales/en/messages.json', './tmp/build/firefox/_locales/en')
    );
});

gulp.task('opera-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/opera/lib'),
        pipe('./src/img/**/*', './tmp/build/opera/img'),
        pipe('./src/js/**/*', './tmp/build/opera/js'),
        pipe('./src/html/**/*', './tmp/build/opera/html'),
        pipe('./src/vendor/opera/browser.js', './tmp/build/opera/js'),
        pipe('./src/vendor/opera/background.js', './tmp/build/opera/js'),
        pipe('./src/vendor/opera/manifest.json', './tmp/build/opera'),
        pipe('./src/_locales/en/messages.json', './tmp/build/opera/_locales/en')
    );
});

gulp.task('safari-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/safari/lib'),
        pipe('./src/img/**/*', './tmp/build/safari/img'),
        pipe('./src/js/**/*', './tmp/build/safari/js'),
        pipe('./src/html/**/*', './tmp/build/safari/html'),
        pipe('./src/vendor/safari/browser.js', './tmp/build/safari/js'),
        pipe('./src/vendor/safari/global.html', './tmp/build/safari/html'),
        pipe('./src/vendor/safari/global.js', './tmp/build/safari/js'),
        pipe('./src/vendor/safari/safari-toolbar.png', './tmp/build/safari'),
        pipe('./src/vendor/safari/safari-toolbar@2x.png', './tmp/build/safari'),
        pipe('./src/vendor/safari/Info.plist', './tmp/build/safari'),
        pipe('./src/vendor/safari/Settings.plist', './tmp/build/safari'),
        pipe('./src/img/icon-16.png', './tmp/build/safari'),
        pipe('./src/img/icon-32.png', './tmp/build/safari'),
        pipe('./src/img/icon-64.png', './tmp/build/safari'),
        pipe('./src/_locales/en/messages.json', './tmp/build/safari/_locales/en')
    );
});

gulp.task('vivaldi-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/vivaldi/lib'),
        pipe('./src/img/**/*', './tmp/build/vivaldi/img'),
        pipe('./src/js/**/*', './tmp/build/vivaldi/js'),
        pipe('./src/html/**/*', './tmp/build/vivaldi/html'),
        pipe('./src/vendor/vivaldi/browser.js', './tmp/build/vivaldi/js'),
        pipe('./src/vendor/vivaldi/background.js', './tmp/build/vivaldi/js'),
        pipe('./src/vendor/vivaldi/manifest.json', './tmp/build/vivaldi'),
        pipe('./src/_locales/en/messages.json', './tmp/build/vivaldi/_locales/en')
    );
});

gulp.task('yandex-build', function () {
    return es.merge(
        pipe('./src/lib/**/*', './tmp/build/yandex/lib'),
        pipe('./src/img/**/*', './tmp/build/yandex/img'),
        pipe('./src/js/**/*', './tmp/build/yandex/js'),
        pipe('./src/html/**/*', './tmp/build/yandex/html'),
        pipe('./src/vendor/yandex/browser.js', './tmp/build/yandex/js'),
        pipe('./src/vendor/yandex/background.js', './tmp/build/yandex/js'),
        pipe('./src/vendor/yandex/manifest.json', './tmp/build/yandex'),
        pipe('./src/_locales/en/messages.json', './tmp/build/yandex/_locales/en')
    );
});

// +---------------------------+
// | Task - Step 3 - Configure |
// +---------------------------+

gulp.task('config', function (cb) {
    return rseq(['chrome-config', 'edge-config', 'firefox-config', 'opera-config', 'safari-config', 'vivaldi-config', 'yandex-config'], cb);
});

gulp.task('chrome-config', function (cb) {
    return rseq(['chrome-config-copy', 'chrome-config-replace'], cb);
});

gulp.task('chrome-config-copy', function () {
    return gulp.src(['./tmp/build/chrome/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/chrome'));
});

gulp.task('chrome-config-replace', function () {
    return gulp.src(['./tmp/build/chrome/**/*.js', './tmp/build/chrome/**/*.json', './tmp/build/chrome/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/chrome'));
});

gulp.task('edge-config', function (cb) {
    return rseq(['edge-config-copy', 'edge-config-replace'], cb);
});

gulp.task('edge-config-copy', function () {
    return gulp.src(['./tmp/build/edge/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/edge'));
});

gulp.task('edge-config-replace', function () {
    return gulp.src(['./tmp/build/edge/**/*.js', './tmp/build/edge/**/*.json', './tmp/build/edge/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/edge'));
});

gulp.task('firefox-config', function (cb) {
    return rseq(['firefox-config-copy', 'firefox-config-replace'], cb);
});

gulp.task('firefox-config-copy', function () {
    return gulp.src(['./tmp/build/firefox/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/firefox'));
});

gulp.task('firefox-config-replace', function () {
    return gulp.src(['./tmp/build/firefox/**/*.js', './tmp/build/firefox/**/*.json', './tmp/build/firefox/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/firefox'));
});

gulp.task('opera-config', function (cb) {
    return rseq(['opera-config-copy', 'opera-config-replace'], cb);
});

gulp.task('opera-config-copy', function () {
    return gulp.src(['./tmp/build/opera/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/opera'));
});

gulp.task('opera-config-replace', function () {
    return gulp.src(['./tmp/build/opera/**/*.js', './tmp/build/opera/**/*.json', './tmp/build/opera/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/opera'));
});

gulp.task('safari-config', function (cb) {
    return rseq(['safari-config-copy', 'safari-config-replace'], cb);
});

gulp.task('safari-config-copy', function () {
    return gulp.src(['./tmp/build/safari/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(ignore.exclude('**/*.plist'))
        .pipe(gulp.dest('./tmp/dev/safari'));
});

gulp.task('safari-config-replace', function () {
    return gulp.src(['./tmp/build/safari/**/*.js', './tmp/build/safari/**/*.json', './tmp/build/safari/**/*.html', './tmp/build/safari/**/*.plist'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/safari'));
});

gulp.task('vivaldi-config', function (cb) {
    return rseq(['vivaldi-config-copy', 'vivaldi-config-replace'], cb);
});

gulp.task('vivaldi-config-copy', function () {
    return gulp.src(['./tmp/build/vivaldi/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/vivaldi'));
});

gulp.task('vivaldi-config-replace', function () {
    return gulp.src(['./tmp/build/vivaldi/**/*.js', './tmp/build/vivaldi/**/*.json', './tmp/build/vivaldi/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/vivaldi'));
});

gulp.task('yandex-config', function (cb) {
    return rseq(['yandex-config-copy', 'yandex-config-replace'], cb);
});

gulp.task('yandex-config-copy', function () {
    return gulp.src(['./tmp/build/yandex/**/*'])
        .pipe(ignore.exclude('**/*.js'))
        .pipe(ignore.exclude('**/*.json'))
        .pipe(ignore.exclude('**/*.html'))
        .pipe(gulp.dest('./tmp/dev/yandex'));
});

gulp.task('yandex-config-replace', function () {
    return gulp.src(['./tmp/build/yandex/**/*.js', './tmp/build/yandex/**/*.json', './tmp/build/yandex/**/*.html'])
        .pipe(replace({global: config}))
        .pipe(gulp.dest('./tmp/dev/yandex'));
});

// +------------------------------+
// | Task - Step 4 - Store Assets |
// +------------------------------+

gulp.task('store', function (cb) {
    return rseq(['chrome-store', 'edge-store', 'firefox-store', 'opera-store', 'safari-store', 'vivaldi-store', 'yandex-store'], cb);
});

gulp.task('chrome-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/chrome/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/chrome'));
});

gulp.task('edge-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/edge/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/edge'));
});

gulp.task('firefox-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/firefox/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/firefox'));
});

gulp.task('opera-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/opera/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/opera'));
});

gulp.task('safari-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/safari/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/safari'));
});

gulp.task('vivaldi-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/vivaldi/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/vivaldi'));
});

gulp.task('yandex-store', function () {
    return gulp.src(['./src/store/change-log.txt', './src/store/yandex/screenshot.png'])
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-store.zip'))
        .pipe(gulp.dest('./tmp/dist/yandex'));
});

// +----------------------------+
// | Task - Step 5 - Distribute |
// +----------------------------+

gulp.task('dist', function (cb) {
    return rseq(['chrome-dist', 'edge-dist', 'firefox-dist', 'opera-dist', 'safari-dist', 'vivaldi-dist', 'yandex-dist'], cb);
});

gulp.task('chrome-dist', function () {
    gulp.src('./tmp/dev/chrome/**/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.zip'))
        .pipe(gulp.dest('./tmp/dist/chrome'));
});

gulp.task('edge-dist', function () {
    gulp.src('./tmp/dev/edge/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.zip'))
        .pipe(gulp.dest('./tmp/dist/edge'));
});

gulp.task('firefox-dist', function () {
    gulp.src('./tmp/dev/firefox/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.xpi'))
        .pipe(gulp.dest('./tmp/dist/firefox'));
});

gulp.task('opera-dist', function () {
    gulp.src('./tmp/dev/opera/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.zip'))
        .pipe(gulp.dest('./tmp/dist/opera'));
});

gulp.task('safari-dist', function () {
    gulp.src('./tmp/dev/safari/**/*')
        .pipe(gulp.dest('./tmp/dist/safari/recordseek-' + config.version + '-' + environment + '.safariextension'));
});

gulp.task('vivaldi-dist', function () {
    gulp.src('./tmp/dev/vivaldi/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.zip'))
        .pipe(gulp.dest('./tmp/dist/vivaldi'));
});

gulp.task('yandex-dist', function () {
    gulp.src('./tmp/dev/yandex/**/*')
        .pipe(zip('recordseek-' + config.version + '-' + environment + '-extension.zip'))
        .pipe(gulp.dest('./tmp/dist/yandex'));
});