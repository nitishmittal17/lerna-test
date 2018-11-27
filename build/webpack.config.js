const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	entry: {
		bundle: path.resolve(__dirname, './app.js')
	} ,
	output: {
		path: path.resolve(__dirname, '../dist')
	},
	devServer: {
		port: 3000,
		open: true
	},
	node: {
		fs: 'empty'
	},
	module: {
		rules: [
			{ test: /\.scss/, use: [
				MiniCssExtractPlugin.loader,
				{
					loader: "css-loader",
					options: {

					}
				},
				{
					loader: "sass-loader",
					options: {

					}
				}
			] },
			{test: /\.handlebars$/, use: 'raw-loader'},
			{test: /\.script/, use: 'raw-loader'}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "styles.css",
			chunkFilename: "[id].css"
		}),
		new HtmlWebpackPlugin()
	]
};