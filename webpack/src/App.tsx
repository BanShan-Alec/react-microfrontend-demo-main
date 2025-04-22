import React, { Suspense } from 'react';
import Remote from 'remote/remote-app';
import './index.scss';
import Related from './Related';

// const Remote = lazy(
// 	// @ts-ignore
// 	async () => import('remote/remote-app')
// );

export const App = () => (
	<div>
		<Related />
		<Suspense fallback={<div>Loading...</div>}>
			<Remote />
		</Suspense>
	</div>
);
