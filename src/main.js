import App from './App.svelte';
import Plotly from 'plotly.js-dist';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;