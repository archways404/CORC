import { useEffect, useState } from 'react';

const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 16;

function generateRandomChar() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
	return chars[Math.floor(Math.random() * chars.length)];
}

function App() {
	const [charGrid, setCharGrid] = useState('');

	useEffect(() => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		const cols = Math.floor(width / CHAR_WIDTH);
		const rows = Math.floor(height / CHAR_HEIGHT);

		const generateGrid = () =>
			Array.from({ length: rows }, () =>
				Array.from({ length: cols }, () => generateRandomChar()).join('')
			).join('\n');

		setCharGrid(generateGrid());

		const interval = setInterval(() => {
			setCharGrid(generateGrid());
		}, 10); // 10ms

		return () => clearInterval(interval); // Cleanup on unmount
	}, []);

	return (
		<pre
			style={{
				fontFamily: 'monospace',
				fontSize: `${CHAR_HEIGHT}px`,
				lineHeight: `${CHAR_HEIGHT}px`,
				backgroundColor: 'black',
				color: 'grey',
				margin: 0,
				width: '100vw',
				height: '100vh',
				overflow: 'hidden',
			}}>
			{charGrid}
		</pre>
	);
}

export default App;
