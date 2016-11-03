/*
 * @Author: xiaodengpao
 * @Date:   2016-10-01
 */

'use strict';
var path = require('path');
var webpack = require("webpack");
var config = require('./config.js');
var TARGET = process.env.npm_lifecycle_event;
module.exports = {
    // 入口文件
    entry:{
        app: [ './src/app.js']
    },
    // 输出
    output: {
        // 文件地址，使用绝对路径形式
        path: path.join(__dirname, 'dist'),
        // [name]这里是webpack提供的根据路口文件自动生成的名字
        filename: '[name].js',
        // 公共文件生成的地址
        publicPath: 'dist'
    },
    // // 服务器配置相关  自动刷新
    // devServer: {
    //     historyApiFallback: true,
    //     hot: false,
    //     inline: true,
    //     grogress: true,
    //     port:config.remoteServer.port,
    //     host:config.remoteServer.host
    // },
    
    // 加载器
    module: {
        loaders: [
            // 转化ES6语法
            {
                test: /\.js/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url'
            }
        ]
    },
    // 转化为es5的语法
    babel: {
        presets: ['es2015'],
        // plugins: ['transform-runtime']
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js'],
        // 别名   可以直接用别名来代表设定的路径以及其他
        alias: {
        }
    },
    plugins: [],
        // 开启source-map，webpack有多种source-map，在官网文档可以查到
     devtool: 'eval-source-map'
};

// module.exports.plugins = [
//     new webpack.DefinePlugin({
//     }),
//     new TransferWebpackPlugin([
//         { from: 'img', to: 'img'}
//     ], path.resolve(__dirname, "src")),
//     new TransferWebpackPlugin([
//         { from: 'css', to: 'css'}
//     ], path.resolve(__dirname, "src")),
//     new TransferWebpackPlugin([
//         { from: 'libs', to: 'libs'}
//     ], path.resolve(__dirname, "src"))
// ]
module.exports.devtool = '#source-map'
