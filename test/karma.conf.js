// Karma configuration

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],
        // list of files / patterns to load in the browser
        // TODO: care should be taken with the order in which these are included,
        // if a "class" tries to be "imported" before it gets a chance to be
        // loaded, it will fail when trying to use it (with errors regarding
        // YouClass is not a constructor), we must find a way to load them
        // in the correct order, or at least delay loading until actually
        // used
        files: [
            "node_modules/underscore/underscore.js",
            "test/polyfill_gs.js",
            "src/gs/**/*.js",
            "src/nuevebit/**/*.js",
            "test/unit/**/*.js"
        ],
        // list of files to exclude
        exclude: [
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],
        // web server port
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox'],
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        phantomjsLauncher: {
            // Have phantomjs exit if a ResourceError is encountered 
            // (useful if karma exits without killing phantom)
            exitOnResourceError: true
        }
    });
};
