const helpers = require('./config/helpers');
var webpack = require("webpack");

/*
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
/*
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
// const AUTH0KEY = 'A84lzxmLvj3S2HG8KckHss3IjbJErVKu'
const AUTH0KEY = process.env.auth0_key;
// const AUTH0DOMAIN = 'majalta.eu.auth0.com';
const AUTH0DOMAIN = process.env.auth0_domain;

const METADATA = {
    title: 'Test app AngularJS 2',
    baseUrl: '/',
    ENV: ENV,
    isDevServer: helpers.isWebpackDevServer(),
    AUTH0KEY: AUTH0KEY,
    AUTH0DOMAIN: AUTH0DOMAIN

};

module.exports = {
    /*
    * Static metadata for index.html
    * See: (custom attribute)
    */
    metadata: METADATA,

    /**
    * Developer tool to enhance debugging
    * See: http://webpack.github.io/docs/configuration.html#devtool
    * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    */
    devtool: 'cheap-module-source-map',

    /*
     * The entry point for the bundle
     * Our Angular.js app
     * See: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      'polyfills': './src/polyfills.browser.ts',
      'vendor':    './src/vendor.browser.ts',
      'main':      './src/main.browser.ts'

    },
    debug: false,
    /**
     * The output directory as absolute path (required).
     * See: http://webpack.github.io/docs/configuration.html#output-path
     */
    output: {
        path: helpers.root('dist'),
        filename: '[name].bundle.js',

        /**
        * The filename of the SourceMaps for the JavaScript files.
        * They are inside the output.path directory.
        * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
        */
        sourceMapFilename: '[name].map',
    },
    resolve: {
        extensions: ['', '.js', '.ts'],
        // Make sure root is src
        root: helpers.root('src'),
        // remove other default values
        modulesDirectories: ['node_modules'],
    },
    module: {
        preLoaders: [
            /*
            * Source map loader support for *.js files
            * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
            * See: https://github.com/webpack/source-map-loader
            */
            {
                test: /\.ts$/,
                loader: 'source-map-loader',
                exclude: [
                    // these packages have problems with their sourcemaps
                    helpers.root('node_modules/rxjs'),
                    'node_modules/@angular',
                ]
            }

        ],
        loaders: [
                /*
               * Typescript loader support for .ts and Angular 2 async routes via .async.ts
               * See: https://github.com/s-panferov/awesome-typescript-loader
               */
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: [/\.(spec|e2e)\.ts$/]
            }
        ]
    },
    plugins: [
        /*
        * Plugin: CommonsChunkPlugin
        * Description: Shares common code between the pages.
        * It identifies common modules and put them into a commons chunk.
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
        * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
        */
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor'].reverse()
        }),
        /*
        * Plugin: HtmlWebpackPlugin
        * Description: Simplifies creation of HTML files to serve your webpack bundles.
        * This is especially useful for webpack bundles that include a hash in the filename
        * which changes every compilation.
        *
        * See: https://github.com/ampedandwired/html-webpack-plugin
        */
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunksSortMode: 'dependency'
        }),
        /**
        * Plugin: DefinePlugin
        * Description: Define free variables.
        * Useful for having development builds with debug logging or adding global constants.
        *
        * Environment helpers
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        */
        // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
        new DefinePlugin({
            'ENV': JSON.stringify(METADATA.ENV),
            'process.env': {
                'ENV': JSON.stringify(METADATA.ENV),
                'NODE_ENV': JSON.stringify(METADATA.ENV),
                'AUTH0KEY': JSON.stringify(METADATA.AUTH0KEY),
                'AUTH0DOMAIN':JSON.stringify(METADATA.AUTH0DOMAIN)
            }
        })
    ],
    devServer: {
        port: '8080',
        host: 'localhost',
        historyApiFallback: true,
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000
        },
        outputPath: helpers.root('dist')
    }
}
