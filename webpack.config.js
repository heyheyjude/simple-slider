const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemovePlugin = require('remove-files-webpack-plugin');

//const HTMLWebpackPlugin = require("html-webpack-plugin")

function getBabelLoader(pattern, presets = []){
 return {
	test: pattern,
	exclude: /node_modules/,
	use: {
	 loader: "babel-loader",
	 options: {
		presets: ["@babel/preset-env", ...presets],
		plugins: ["@babel/plugin-proposal-class-properties"],
	 },
	},
 }
}


const jsEntry = {

}

const cssEntry = {
 "simple-slider": ["./style.scss"],
 style : ["./dist-style.scss"]
}

module.exports = {
 context: path.resolve(__dirname, "src"),
 mode: "production",
 entry: {
	"simple-slider.js": {import:["@babel/polyfill", "./index.ts"],
	 filename: "[name]",
	},
	...cssEntry
 },
 output: {
	filename: (entry) => {
	 if(Object.keys(jsEntry).includes(entry.chunk.name)) return "[name].js"
	 return "![name].delete"
	},
	path: path.resolve(__dirname, "dist"),
 },
 resolve: {
	extensions: [".js", ".jsx", ".wasm", ".ts", ".tsx", ".module.scss"],
 },
 plugins: [
	// new HTMLWebpackPlugin({
	//  template: "./index.html",
	// }),
	new RemovePlugin({
	 after:{
		test: [
		 {
			folder: 'dist',
			method: (absoluteItemPath) => {
			 return new RegExp(/\.delete$/, 'm').test(absoluteItemPath);
			},
			recursive: true
		 }
		]
	 }
	}),
	new MiniCssExtractPlugin({
	 filename: (entry) => {
	  if(Object.keys(cssEntry).includes(entry.chunk.name)) return "[name].css"
		return "[name].delete"
	 },
	}),
 ],
 devServer: {
	contentBase: path.join(__dirname, "dist"),
	open: true,
	port: 3000,
	hot: true,
	watchOptions: {
	 aggregateTimeout: 300,
	 poll: true,
	},
 },
 module: {
	rules: [
	 {
		test: /\.(sa|sc|c)ss$/,
		use: [
		 MiniCssExtractPlugin.loader,
		 "css-loader",
		 'sass-loader',
		],
	 },
	 getBabelLoader(/\.m?js$/),
	 getBabelLoader(/\.ts$/, ["@babel/preset-typescript"]),
	 {
		test: /\.[tj]s$/,
		exclude: /node_modules/,
		loader: "eslint-loader",
	 },
	],
 },
}
