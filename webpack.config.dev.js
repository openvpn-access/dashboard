const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const resolveAppVersion = require('./scripts/resolveAppVersion');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const {resolveConfigFile} = require('./scripts/resolveConfigFile');

const globalSCSS = path.resolve(__dirname, 'src/styles/_global.scss');
const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/index.js',

    output: {
        path: dist,
        filename: '[name].js',
        globalObject: `(() => {
            if (typeof self !== 'undefined') {
                return self;
            } else if (typeof window !== 'undefined') {
                return window;
            } else if (typeof global !== 'undefined') {
                return global;
            } else {
                return Function('return this')();
            }
        })()`
    },

    devServer: {
        port: 3000,
        disableHostCheck: true,
        historyApiFallback: true,
        clientLogLevel: 'none',
        stats: 'errors-only',
        quiet: true,
        host: '0.0.0.0',
        liveReload: false,
        overlay: false,
        inline: true,
        hot: true
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
            '@api': path.resolve('./src/api'),
            '@state': path.resolve('./src/state'),
            '@lib': path.resolve('./src/lib'),
            '@utils': path.resolve('./src/utils'),
            '@components': path.resolve('./src/components')
        }
    },

    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(png|jpe?g|gif|eot|ttf|woff|woff2)$/i,
                loader: 'file-loader'
            },
            {
                enforce: 'pre',
                test: /\.s[ac]ss$/,
                use: [
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            additionalData: '@import "src/styles/_variables.scss";',
                            sassOptions: {
                                includePaths: [globalSCSS]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.module\.(scss|sass|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[local]__[name]'
                            }
                        }
                    }
                ]
            },
            {
                test: /(?<!.module)\.(scss|sass|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(js|ts|tsx)$/,
                include: src,
                use: 'babel-loader'
            }
        ]
    },

    optimization: {
        splitChunks: {
            minChunks: 3
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            'env': {
                'config': JSON.stringify(resolveConfigFile()),
                'NODE_ENV': JSON.stringify('development'),
                'VERSION': JSON.stringify(resolveAppVersion()),
                'BUILD_DATE': JSON.stringify(Date.now())
            }
        }),

        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true
        }),

        new CopyPlugin({
            patterns: [
                {context: 'src', from: 'assets'}
            ]
        }),

        new ProgressBarPlugin()
    ]
};
