import { useEffect, useRef, useState } from 'react';

const CHAR_WIDTH = 8;
const CHAR_HEIGHT = 16;

function generateRandomChar() {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
	return chars[Math.floor(Math.random() * chars.length)];
}

function App() {
	const canvasRef = useRef(null);
	const [timeCharPositions, setTimeCharPositions] = useState(new Set());
	const [use12Hour, setUse12Hour] = useState(true);
	const TIME_STRING_LENGTH = use12Hour ? 8 : 5;

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const width = window.innerWidth;
		const height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
		const cols = Math.floor(width / CHAR_WIDTH);
		const rows = Math.floor(height / CHAR_HEIGHT);
		const pixelSize = 2;
		const charSpacing = 2;

		const centerRow = Math.floor(rows / 2);
		const bigCharHeight = 8;
		const bigCharWidth = 6;
		const startColBig =
			Math.floor(cols / 2) -
			Math.floor(((bigCharWidth * pixelSize + charSpacing) * TIME_STRING_LENGTH) / 2);

		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const timeString = use12Hour
			? `${(hours % 12 || 12).toString().padStart(2, '0')}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`
			: `${hours.toString().padStart(2, '0')}:${minutes}`;

		const positions = [];

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

		for (let i = 0; i < timeString.length; i++) {
			const char = timeString[i].toUpperCase();
			const pattern = BIG_FONT[char] || BIG_FONT[' '];
			for (let r = 0; r < bigCharHeight; r++) {
				for (let c = 0; c < bigCharWidth; c++) {
					const gridRow = centerRow - Math.floor((bigCharHeight * pixelSize) / 2) + r * pixelSize;
					const gridCol =
						startColBig + i * (bigCharWidth * pixelSize + charSpacing) + c * pixelSize;
					if (pattern[r][c] === '1') {
						for (let dy = 0; dy < pixelSize; dy++) {
							for (let dx = 0; dx < pixelSize; dx++) {
								const rr = gridRow + dy;
								const cc = gridCol + dx;
								if (rr < rows && cc < cols) {
									positions.push(`${rr},${cc}`);
								}
							}
						}
					}
				}
			}
		}
		setTimeCharPositions(new Set(positions));

		const handleResize = () => window.location.reload();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [use12Hour]);

	useEffect(() => {
		let animationFrameId;
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const width = window.innerWidth;
		const height = window.innerHeight;
		const cols = Math.floor(width / CHAR_WIDTH);
		const rows = Math.floor(height / CHAR_HEIGHT);

		let lastFrameTime = 0;
		const frameInterval = 1000 / 30;

		function draw(timestamp) {
			if (timestamp - lastFrameTime < frameInterval) {
				animationFrameId = requestAnimationFrame(draw);
				return;
			}
			lastFrameTime = timestamp;
			ctx.fillStyle = '#0a0a0a';
			ctx.fillRect(0, 0, width, height);

			ctx.font = `${CHAR_HEIGHT}px monospace`;
			ctx.textBaseline = 'top';

			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const char = generateRandomChar();
					const key = `${r},${c}`;
					ctx.fillStyle = timeCharPositions.has(key) ? '#37ff00' : '#434343';
					ctx.fillText(char, c * CHAR_WIDTH, r * CHAR_HEIGHT);
				}
			}

			animationFrameId = requestAnimationFrame(draw);
		}

		animationFrameId = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(animationFrameId);
	}, [timeCharPositions]);

	return (
		<>
			<button
				onClick={() => setUse12Hour(!use12Hour)}
				style={{
					position: 'absolute',
					top: '1rem',
					left: '1rem',
					zIndex: 10,
					background: 'transparent',
					color: '#37ff00',
					padding: '0.5rem 1rem',
					border: '1px solid #37ff00',
					cursor: 'pointer',
					fontFamily: 'monospace',
				}}>
				{use12Hour ? '12h' : '24h'}
			</button>
			<canvas
				ref={canvasRef}
				style={{ display: 'block', width: '100vw', height: '100vh' }}
			/>
		</>
	);
}

export default App;
