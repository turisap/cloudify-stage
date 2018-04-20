'use strict';

const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const getWidgetEntries = () => {
    return glob.sync('./widgets/*/src/widget.js').reduce((acc, item) => {
        let name = item.replace('./widgets', '').replace('/src', '');
        acc[name] = item;
        return acc;
    }, {});
}

const rules = [
    {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            options: {
                presets: [['env', {modules: false}], 'react', 'stage-0'],
                plugins: ['transform-runtime'],
                babelrc: false
            }
        }]
    }, {
        test: /\.scss$/,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',

            options: {
                minimize: true
            }
        }, {
            loader: 'sass-loader',

            options: {
                modules: true,
                localIdentName: '[name]---[local]---[hash:base64:5]'
            }
        }]
    }, {
        test: /\.css$/,
        use: [{
            loader: 'style-loader'
        }, {
            loader: 'css-loader',

            options: {
                importLoaders: 1,
                minimize: true
            }
        }]
    }, {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
        use: [{
            loader: 'url-loader',

            options: {
                limit: 100000,
                name: '[name].[ext]'
            }
        }]
    }
];

const compressionPlugins = [
    new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
    new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
    })
];

module.exports = [
    {
        mode: 'production',
        context: path.join(__dirname),
        resolve: {
            alias: {
                'jquery-ui': 'jquery-ui/ui',
                'jquery': __dirname + '/node_modules/jquery' // Always make sure we take jquery from the same place
            }
        },
        entry: [
            './app/main.js'
        ],
        output: {
            path: path.join(__dirname, 'dist'),
            filename: '[name].bundle.js',
            publicPath: '/stage'
        },
        optimization: {
            splitChunks: {
                chunks: 'initial',
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'initial',
                    },
                },
            },
        },
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin([
                {
                    from: 'app/images',
                    to: 'app/images'
                }
            ]),
            new CopyWebpackPlugin([
                {
                    from: 'widgets',
                    to: 'widgets',
                    ignore: ['**/src/*', '**/widget.js', '**/common.js']
                }
            ]),
            new CopyWebpackPlugin([
                {
                    from: 'templates',
                    to: 'templates'
                }
            ]),
            new HtmlWebpackPlugin({
                template: 'app/index.tmpl.html',
                inject: 'body',
                filename: 'index.html'
            }),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                d3: 'd3'
            }),
            ...compressionPlugins
        ],
        module: {
            rules
        }
    },
    {
        mode: 'production',
        context: path.join(__dirname),
        entry: getWidgetEntries(),
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'widgets/[name]',
            publicPath: '/stage'
        },
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: 'widgets/**/src/backend.js',
                    to: '[path]../backend.js'
                }
            ]),
            ...compressionPlugins
        ],
        module: {
            rules
        }
    },
    {
        mode: 'production',
        context: path.join(__dirname),
        entry: glob.sync('./widgets/common/src/*.js'),
        output: {
            path: path.join(__dirname, 'dist/widgets'),
            filename: 'common/common.js',
            publicPath: '/stage'
        },
        plugins: compressionPlugins,
        module: {
            rules
        }
    }
];