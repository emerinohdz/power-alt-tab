// Karma configuration
// Generated on Thu Feb 19 2015 13:54:45 GMT-0600 (CST)

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
        // TODO: usar scripts.json
        files: [
            // este polyfill se agrega porque algunas versiones antiguas de
            // phantomjs no soportan Function.prototype.bind
            //"public_html/bower_components/underscore/underscore.js",
            //"public_html/bower_components/angular/angular.js",
            //"public_html/bower_components/angular-mocks/angular-mocks.js",
            //"public_html/bower_components/angular-route/angular-route.js",
            //"public_html/bower_components/angular-resource/angular-resource.js",            
            //"public_html/js/application.js",             
            //"public_html/js/services.js",            
            //"public_html/js/scripts.js",            
            //"public_html/js/controllers/*.js",            
            "node_modules/underscore/underscore.js",
            "test/polyfill_gs.js",
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
