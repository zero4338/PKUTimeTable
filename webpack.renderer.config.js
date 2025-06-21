const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        renderer: path.resolve(__dirname, 'src/renderer/index.tsx'),
    },
    module: {
        rules: [
        {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                },
            },
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/renderer/index.html'),
        }),
    ],
};