/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var path = require('path');
var glob = require("glob");

module.exports = {
    entry: {
        extension: "./src/extension.js",
        test: glob.sync("./test/**/*.js")
    },
    output: {
        filename: "[name].js",
        libraryTarget: 'umd',
    },
    resolve: {
        modules: [
            path.resolve('./src'),
            'node_modules'
        ]
    },
};