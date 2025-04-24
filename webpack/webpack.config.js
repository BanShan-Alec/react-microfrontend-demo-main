const HtmlWebPackPlugin = require('html-webpack-plugin');
// const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const dependencies = require('./package.json').dependencies;
const ModuleFederationPlugin = require('@module-federation/enhanced/webpack').ModuleFederationPlugin;
const printCompilationMessage = require('./compilation.config.js');

module.exports = {
	context: __dirname,
	output: {
		publicPath: 'auto',
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
	},

	// 添加 optimization 配置，禁用代码压缩和混淆
	optimization: {
		minimize: false,
	},

	devServer: {
		port: 8080,
		historyApiFallback: true,
		watchFiles: [path.resolve(__dirname, 'src')],
		onListening: function (devServer) {
			const port = devServer.server.address().port;

			printCompilationMessage('compiling', port);

			devServer.compiler.hooks.done.tap('OutputMessagePlugin', (stats) => {
				setImmediate(() => {
					if (stats.hasErrors()) {
						printCompilationMessage('failure', port);
					} else {
						printCompilationMessage('success', port);
					}
				});
			});
		},
	},

	module: {
		rules: [
			{
				test: /\.(svg|png)$/,
				type: 'asset',
			},
			{
				test: /\.m?js/,
				type: 'javascript/auto',
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.(css|s[ac]ss)$/i,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(ts|tsx|js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},

	plugins: [
		new ModuleFederationPlugin({
			name: 'webpack',
			// filename: 'remoteEntry.js',
			// remoteType: 'module',
			// remoteType: 'script',
			remotes: {
				remote: `promise import('http://localhost:4174/remoteEntry.js')
				     .then(module => ({
				     get: request => module.get(request),
				     init: arg => module.init(arg)
				 }))`,
				// remote: 'remote@http://localhost:4174/remoteEntry.js',
				// remote: 'remote@http://localhost:4174/mf-manifest.json',
			},
			shared: {
				react: {
					singleton: true,
				},
				'react-dom': {
					singleton: true,
				},
			},
			experiments: {
				provideExternalRuntime: true,
			},
		}),
		// new ModuleFederationPlugin({
		// 	name: 'webpack',
		// 	filename: 'remoteEntry.js',
		// 	remotes: {},
		// 	exposes: {
		// 		'./Related': './src/Related.tsx',
		// 	},
		// 	shared: {
		// 		...deps,
		// 		react: {
		// 			singleton: true,
		// 		},
		// 		'react-dom': {
		// 			singleton: true,
		// 		},
		// 	},
		// }),
		new HtmlWebPackPlugin({
			template: './src/index.html',
			// excludeChunks: ['remoteEntry.js'],
		}),
		new Dotenv(),
	],
};
