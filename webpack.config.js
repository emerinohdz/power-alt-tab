/* 
 * Copyright 2017 NueveBit, todos los derechos reservados.
 */

var path = require('path');


module.exports = {
    entry: {
        extension: "./src/extension.js"
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
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            require('babel-preset-env'),
                        ],
                        plugins: [
                            require('babel-plugin-transform-runtime'),
                            require('babel-plugin-transform-es2015-modules-umd'),
                        ]
                    }
                }
            },
        ]
    },
};