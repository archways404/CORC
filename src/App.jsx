import { useEffect, useState } from 'react';

const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 16;
const TIME_STRING_LENGTH = 8; // "HH:MM XM"

function generateRandomChar() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
	return chars[Math.floor(Math.random() * chars.length)];
}

function App() {
	const [charGrid, setCharGrid] = useState([]);

	useEffect(() => {
		const updateGrid = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			const cols = Math.floor(width / CHAR_WIDTH);
			const rows = Math.floor(height / CHAR_HEIGHT);

			// Get time as string: "01:22 PM"
			const now = new Date();
			const hours = now.getHours();
			const hours12 = hours % 12 || 12;
			const ampm = hours >= 12 ? 'PM' : 'AM';
			const minutes = now.getMinutes().toString().padStart(2, '0');
			const timeString = `${hours12.toString().padStart(2, '0')}:${minutes} ${ampm}`;

			const pixelSize = 2;
			const charSpacing = 2; // horizontal space between big characters

			// Center time
			const centerRow = Math.floor(rows / 2); // true screen center in character rows

			const newGrid = Array.from({ length: rows }, (_, r) =>
				Array.from({ length: cols }, (_, c) => ({
					char: generateRandomChar(),
					isTimeChar: false,
				}))
			);

			// BIG_FONT definition for ASCII-style big characters
			const BIG_FONT = {
				0: ['011110', '100001', '100011', '100101', '101001', '110001', '100001', '011110'],
				1: ['001100', '010100', '100100', '000100', '000100', '000100', '000100', '111111'],
				2: ['011110', '100001', '000001', '000010', '000100', '001000', '010000', '111111'],
				3: ['011110', '100001', '000001', '001110', '000001', '000001', '100001', '011110'],
				4: ['000110', '001010', '010010', '100010', '111111', '000010', '000010', '000111'],
				5: ['111111', '100000', '100000', '111110', '000001', '000001', '100001', '011110'],
				6: ['001110', '010000', '100000', '111110', '100001', '100001', '100001', '011110'],
				7: ['111111', '000001', '000010', '000100', '001000', '010000', '100000', '100000'],
				8: ['011110', '100001', '100001', '011110', '100001', '100001', '100001', '011110'],
				9: ['011110', '100001', '100001', '100001', '011111', '000001', '000010', '011100'],
				':': ['000000', '001100', '001100', '000000', '000000', '001100', '001100', '000000'],
				A: ['001100', '010010', '100001', '100001', '111111', '100001', '100001', '100001'],
				M: ['100001', '110011', '101101', '100001', '100001', '100001', '100001', '100001'],
				P: ['111110', '100001', '100001', '111110', '100000', '100000', '100000', '100000'],
				' ': ['000000', '000000', '000000', '000000', '000000', '000000', '000000', '000000'],
			};

			// Big font overlay logic
			const bigCharHeight = 8;
			const bigCharWidth = 6;
			const totalBigCharWidth = bigCharWidth * timeString.length;
			const startColBig = Math.floor(cols / 2) - Math.floor((bigCharWidth * pixelSize + charSpacing) * timeString.length / 2);

			for (let i = 0; i < timeString.length; i++) {
				const char = timeString[i].toUpperCase();
				const pattern = BIG_FONT[char] || BIG_FONT[' '];
				for (let r = 0; r < bigCharHeight; r++) {
					for (let c = 0; c < bigCharWidth; c++) {
						const gridRow = centerRow - Math.floor(bigCharHeight * pixelSize / 2) + r * pixelSize;
						const gridCol = startColBig + i * (bigCharWidth * pixelSize + charSpacing) + c * pixelSize;
						if (gridRow >= 0 && gridRow < rows && gridCol >= 0 && gridCol < cols) {
							const pixel = pattern[r][c];

							if (pixel === '1') {
								for (let dy = 0; dy < pixelSize; dy++) {
									for (let dx = 0; dx < pixelSize; dx++) {
										const rr = gridRow + dy;
										const cc = gridCol + dx;
										if (rr < rows && cc < cols) {
											newGrid[rr][cc].isTimeChar = true;
										}
									}
								}
							}
						}
					}
				}
			}

			setCharGrid(newGrid);
		};

		updateGrid(); // Initial
		const interval = setInterval(updateGrid, 200); // reduce to 200ms

		return () => clearInterval(interval);
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
			{charGrid.map((row, rIdx) => (
				<div key={rIdx}>
					{row.map((cell, cIdx) => (
						<span
							key={cIdx}
							style={{
								color: cell.isTimeChar ? 'white' : 'grey',
							}}>
							{cell.char}
						</span>
					))}
				</div>
			))}
		</pre>
	);
}

export default App;
