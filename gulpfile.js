"use strict"
var gulp = require('gulp');
var rename = require('gulp-rename');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var del = require('del');
var srcmap = require('gulp-sourcemaps');
var config = require('./tasks/config');
var cproc = require('child_process');
var nls = require('vscode-nls-dev');
const path = require('path');
const es = require('event-stream');
require('./tasks/packagetasks')

const languages = [
    { id: 'zh-Hant', folderName: 'cht', transifexId: 'zh-hant' },
    { id: 'zh-Hans', folderName: 'chs', transifexId: 'zh-hans' },
    { id: 'ja', folderName: 'jpn' },
    { id: 'ko', folderName: 'kor' },
    { id: 'de', folderName: 'deu' },
    { id: 'fr', folderName: 'fra' },
    { id: 'es', folderName: 'esn' },
    { id: 'ru', folderName: 'rus' },
    { id: 'it', folderName: 'ita' },

    // These language-pack languages are included for VS but excluded from the vscode package
    { id: 'tr', folderName: 'trk' },
    { id: 'pt-BR', folderName: 'ptb', transifexId: 'pt-BR' },
];

const cleanTask = function() {
	return del(['out/**', 'package.nls.*.json']);
}


gulp.task('ext:lint', () => {
    return gulp.src([
        config.paths.project.root + '/src/**/*.ts',
        '!' + config.paths.project.root + '/src/**/*.d.ts',
        config.paths.project.root + '/test/**/*.ts'
    ])
    .pipe((tslint({
        formatter: "verbose"
    })))
    .pipe(tslint.report());
});

const addI18nTask = function() {
	return gulp.src(['package.nls.json'])
        .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
		.pipe(gulp.dest('.'));
};

gulp.task('ext:compile-src', (done) => {
    return gulp.src([
                config.paths.project.root + '/src/**/*.ts',
                config.paths.project.root + '/src/**/*.js'])
                .pipe(srcmap.init())
                .pipe(tsProject())
                .on('error', function() {
                    if (process.env.BUILDMACHINE) {
                        done('Extension Tests failed to build. See Above.');
                        process.exit(1);
                    }
                })
                .pipe(nls.rewriteLocalizeCalls())
                .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', 'out'))
                .pipe(srcmap.write('.', {
                   sourceRoot: function(file){ return file.cwd + '/src'; }
                }))
                .pipe(gulp.dest('out/'));
});

// generate metadata containing all localized files in src directory, to be used later by exporti18n task to create an xlf file.
gulp.task('generate-metadata', (done) => {
    return gulp.src([
                config.paths.project.root + '/src/**/*.ts',
                config.paths.project.root + '/src/**/*.js'])
                .pipe(srcmap.init())
                .pipe(tsProject())
                .on('error', function() {
                    if (process.env.BUILDMACHINE) {
                        done('Extension Tests failed to build. See Above.');
                        process.exit(1);
                    }
                })
                .pipe(nls.rewriteLocalizeCalls())
                .pipe(nls.bundleMetaDataFiles('mysql-extension', 'out'))
                .pipe(nls.bundleLanguageFiles())
                .pipe(srcmap.write('.', {
                   sourceRoot: function(file){ return file.cwd + '/src'; }
                }))
                .pipe(gulp.dest('out/'));
});

// Creates an xlf file containing all the localized strings. This file is picked by translation pipeline.
const exporti18n = function() {
	return gulp.src(['package.nls.json', 'out/nls.metadata.header.json', 'out/nls.metadata.json'])
			.pipe(nls.createXlfFiles("l10n", "l10n-sample"))
			.pipe(gulp.dest(path.join('src')));
};

// Use the returned xlf files for all languages and fill i18n dir with respective lang files in respective lang dir.
const importi18n = function() {
    return Promise.resolve(es.merge(languages.map(language => {
        return gulp.src(`src/l10n/transXlf/l10n-sample.${language.id}.xlf`, { allowEmpty: true })
                .pipe(nls.prepareJsonFiles())
                .pipe(gulp.dest(path.join('./i18n', language.folderName)));
    })));
}

gulp.task('ext:compile-tests', (done) => {
    return gulp.src([
                config.paths.project.root + '/test/**/*.ts',
                config.paths.project.root + '/typings/**/*.ts'])
                .pipe(srcmap.init())
                .pipe(tsProject())
                .on('error', function() {
                    if (process.env.BUILDMACHINE) {
                        done('Extension Tests failed to build. See Above.');
                        process.exit(1);
                    }
                })
                .pipe(srcmap.write('.', {
                   sourceRoot: function(file){ return file.cwd + '/test'; }
                }))
                .pipe(gulp.dest('out/test/'));

});

gulp.task('ext:localize', gulp.series('generate-metadata', exporti18n));

gulp.task('ext:import', importi18n);

gulp.task('ext:compile', gulp.series(cleanTask, 'ext:compile-src', addI18nTask, 'ext:compile-tests'));

gulp.task('ext:copy-tests', () => {
    return gulp.src(config.paths.project.root + '/test/resources/**/*')
            .pipe(gulp.dest(config.paths.project.root + '/out/test/resources/'))
});

gulp.task('ext:copy-config', () => {
    var env = process.env.VsMsSqlEnv;
    env = env == undefined ? "dev" : env;
    return gulp.src(config.paths.project.root + '/src/config.json')
            .pipe(rename('config.json'))
            .pipe(gulp.dest(config.paths.project.root + '/out/'));
});

gulp.task('ext:copy-js', () => {
    return gulp.src([
            config.paths.project.root + '/src/**/*.js',
            '!' + config.paths.project.root + '/src/views/htmlcontent/**/*'])
        .pipe(gulp.dest(config.paths.project.root + '/out/'))
});

gulp.task('ext:copy', gulp.series('ext:copy-tests', 'ext:copy-js', 'ext:copy-config'));

gulp.task('ext:build', gulp.series('ext:compile', 'ext:copy'));

gulp.task('ext:test', (done) => {
    let workspace = process.env['WORKSPACE'];
    if (!workspace) {
        workspace = process.cwd();
    }
    process.env.JUNIT_REPORT_PATH = workspace + '/test-reports/ext_xunit.xml';
    cproc.exec(`code --extensionDevelopmentPath="${workspace}" --extensionTestsPath="${workspace}/out/test" --verbose`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            process.exit(1);
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        done();
    });
});

gulp.task('test', gulp.series('ext:test'));

require('./tasks/covertasks');

gulp.task('clean', function (done) {
    return del('out', done);
});

gulp.task('build', gulp.series('clean', 'ext:build'));

gulp.task('watch', function(){
    return gulp.watch(config.paths.project.root + '/src/**/*', gulp.series('build'))
});
