import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { dependencies } from './package.json';

export default defineConfig(() => ({
	server: { fs: { allow: ['.', '../shared'] } },
	build: {
		target: 'chrome89',
		minify: false, // 禁用代码压缩和混淆
	},
	plugins: [
		federation({
			name: 'host',
			remotes: {
				remote: {
					type: 'module',
					name: 'remote',
					entry: 'http://localhost:4174/remoteEntry.js',
					entryGlobalName: 'remote',
					shareScope: 'default',
				},
			},
			shared: {
				react: {
					requiredVersion: dependencies.react,
					singleton: true,
				},
			},
		}),
		react(),
	],
}));
