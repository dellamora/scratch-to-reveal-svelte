<script lang="ts">
	import { onMount } from 'svelte';

	export interface Competition {
		id: string;
		hasPrize: boolean;
		prizeValue?: number;
	}

	export let competitions: Competition[] = [];
	export let minScratchPercentage = 50;
	export let onComplete: (() => void) | undefined = undefined;

	let canvas: HTMLCanvasElement;
	let isScratching = false;
	let isComplete = false;
	let containerEl: HTMLDivElement;
	let animationId: number | null = null;

	const SQUARE_SIZE = 53;
	const GAP = 4;

	let columns = 5
	let actualSquareSize = SQUARE_SIZE;

	$: rows = Math.ceil(competitions.length / columns);
	$: totalWidth = columns * actualSquareSize + (columns - 1) * GAP;
	$: totalHeight = rows * actualSquareSize + (rows - 1) * GAP;

	onMount(() => {
		const updateColumns = () => {
			const width = window.innerWidth;
			columns = 5 
			actualSquareSize = SQUARE_SIZE;
		};

		updateColumns();
		window.addEventListener('resize', updateColumns);

		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.fillStyle = '#061140';
		ctx.fillRect(0, 0, totalWidth, totalHeight);

		return () => {
			window.removeEventListener('resize', updateColumns);
			if (animationId) cancelAnimationFrame(animationId);
		};
	});

	function handleMouseDown() {
		isScratching = true;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isScratching) return;
		scratch(e.clientX, e.clientY);
	}

	function handleMouseUp() {
		isScratching = false;
		checkCompletion();
	}

	function handleTouchStart() {
		isScratching = true;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isScratching) return;
		const touch = e.touches[0];
		scratch(touch.clientX, touch.clientY);
	}

	function handleTouchEnd() {
		isScratching = false;
		checkCompletion();
	}

	function scratch(clientX: number, clientY: number, radius = 30) {
		const ctx = canvas?.getContext('2d');
		if (!ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;
		
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	function checkCompletion() {
		if (isComplete) return;

		const ctx = canvas?.getContext('2d');
		if (!ctx) return;

		const imageData = ctx.getImageData(0, 0, totalWidth, totalHeight);
		const pixels = imageData.data;
		const totalPixels = pixels.length / 4;
		let clearPixels = 0;

		for (let i = 3; i < pixels.length; i += 4) {
			if (pixels[i] === 0) clearPixels++;
		}

		const percentage = (clearPixels / totalPixels) * 100;

		if (percentage >= minScratchPercentage) {
			isComplete = true;
			ctx.clearRect(0, 0, totalWidth, totalHeight);
			if (onComplete) onComplete();
		}
	}

	// Generate realistic scratching path points
	function generateScratchPath() {
		const points: Array<{x: number, y: number, radius: number, delay: number}> = [];
		const padding = 20;
		const rect = canvas.getBoundingClientRect();
		
		// Create zigzag pattern with some randomness
		const numRows = 8;
		const rowHeight = (totalHeight - padding * 2) / numRows;
		
		for (let row = 0; row < numRows; row++) {
			const y = padding + row * rowHeight + Math.random() * 10;
			const startX = row % 2 === 0 ? padding : totalWidth - padding;
			const endX = row % 2 === 0 ? totalWidth - padding : padding;
			const numPoints = 15 + Math.floor(Math.random() * 5);
			
			for (let i = 0; i <= numPoints; i++) {
				const progress = i / numPoints;
				const x = startX + (endX - startX) * progress;
				
				// Add some waviness to the path
				const waveX = x + Math.sin(progress * Math.PI * 4) * 15;
				const waveY = y + Math.cos(progress * Math.PI * 3) * 8;
				
				// Vary the radius for more realistic effect
				const radius = 25 + Math.random() * 15;
				
				// Vary the speed (delay between points)
				const delay = 8 + Math.random() * 4;
				
				points.push({
					x: rect.left + waveX,
					y: rect.top + waveY,
					radius,
					delay
				});
			}
			
			// Add some random circular motions occasionally
			if (row % 3 === 0 && row < numRows - 1) {
				const centerX = rect.left + padding + Math.random() * (totalWidth - padding * 2);
				const centerY = rect.top + y + rowHeight / 2;
				const circleRadius = 20 + Math.random() * 20;
				
				for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
					points.push({
						x: centerX + Math.cos(angle) * circleRadius,
						y: centerY + Math.sin(angle) * circleRadius,
						radius: 30 + Math.random() * 10,
						delay: 5
					});
				}
			}
		}
		
		// Add some final random strokes to ensure coverage
		for (let i = 0; i < 20; i++) {
			points.push({
				x: rect.left + padding + Math.random() * (totalWidth - padding * 2),
				y: rect.top + padding + Math.random() * (totalHeight - padding * 2),
				radius: 35 + Math.random() * 15,
				delay: 10
			});
		}
		
		return points;
	}

	// Animate the scratching
	function animateScratch() {
		if (animationId) cancelAnimationFrame(animationId);
		
		const path = generateScratchPath();
		let currentIndex = 0;
		let lastTime = 0;
		let accumulatedTime = 0;
		
		function animate(timestamp: number) {
			if (!lastTime) lastTime = timestamp;
			const deltaTime = timestamp - lastTime;
			lastTime = timestamp;
			accumulatedTime += deltaTime;
			
			// Process multiple points if needed to catch up
			while (currentIndex < path.length && accumulatedTime >= path[currentIndex].delay) {
				const point = path[currentIndex];
				scratch(point.x, point.y, point.radius);
				accumulatedTime -= point.delay;
				currentIndex++;
				
				// Check completion periodically
				if (currentIndex % 20 === 0) {
					checkCompletion();
					if (isComplete) {
						if (animationId) cancelAnimationFrame(animationId);
						return;
					}
				}
			}
			
			if (currentIndex < path.length && !isComplete) {
				animationId = requestAnimationFrame(animate);
			} else {
				// Final completion check
				checkCompletion();
				if (!isComplete) {
					// If not complete, do a few more random scratches
					for (let i = 0; i < 30; i++) {
						const rect = canvas.getBoundingClientRect();
						scratch(
							rect.left + Math.random() * totalWidth,
							rect.top + Math.random() * totalHeight,
							40
						);
					}
					checkCompletion();
				}
			}
		}
		
		animationId = requestAnimationFrame(animate);
	}

	export function scratchAll() {
		// Start the animation instead of clearing instantly
		animateScratch();
	}
</script>

<div 
	bind:this={containerEl}
	class="relative select-none max-w-full h-full"
>
	<!-- Ticket Container with background -->
	<div 
		class="relative bg-[#FFFBF4] rounded-2xl border border-[#E1E3E8] p-3 overflow-hidden"
		
	>
		<!-- Background SVG -->
		<svg 
			class="absolute left-0 top-8 w-full h-full" 
			viewBox="0 0 {totalWidth} {totalHeight}" 
			preserveAspectRatio="none"
			fill="none" 
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M{totalWidth} {totalHeight * 0.9}L{totalWidth * 0.98} {totalHeight * 0.99}L{totalWidth * 0.97} {totalHeight}H0V{totalHeight * 0.4}L{totalWidth * 0.07} {totalHeight * 0.39}L{totalWidth * 0.29} {totalHeight * 0.15}C{totalWidth * 0.3} {totalHeight * 0.13} {totalWidth * 0.32} {totalHeight * 0.1} {totalWidth * 0.35} {totalHeight * 0.12}C{totalWidth * 0.38} {totalHeight * 0.14} {totalWidth * 0.41} {totalHeight * 0.14} {totalWidth * 0.42} {totalHeight * 0.14}L{totalWidth * 0.69} 0H{totalWidth * 0.71}L{totalWidth * 0.72} {totalHeight * 0.015}C{totalWidth * 0.84} {totalHeight * 0.12} {totalWidth * 0.86} {totalHeight * 0.13} {totalWidth * 0.88} {totalHeight * 0.14}C{totalWidth * 0.9} {totalHeight * 0.14} {totalWidth * 0.92} {totalHeight * 0.16} {totalWidth * 0.92} {totalHeight * 0.17}L{totalWidth * 0.91} {totalHeight * 0.21}C{totalWidth * 0.93} {totalHeight * 0.22} {totalWidth * 0.92} {totalHeight * 0.24} {totalWidth * 0.92} {totalHeight * 0.24}L{totalWidth * 0.95} {totalHeight * 0.3}L{totalWidth * 0.98} {totalHeight * 0.32}C{totalWidth * 0.96} {totalHeight * 0.4} {totalWidth * 0.85} {totalHeight * 0.46} {totalWidth * 0.8} {totalHeight * 0.47}L{totalWidth * 0.66} {totalHeight * 0.22}L{totalWidth * 0.57} {totalHeight * 0.19}L{totalWidth * 0.58} {totalHeight * 0.21}L{totalWidth * 0.65} {totalHeight * 0.23}L{totalWidth} {totalHeight * 0.9}Z" fill="#FFBD3A" fill-opacity="0.12"/>
		</svg>

		<!-- Ticket Grid -->
		<div 
			class="relative grid gap-3"
			style="
				grid-template-columns: repeat({columns}, {actualSquareSize}px);
			"
		>
			{#each competitions as comp (comp.id)}
				<div 
					class="{comp.hasPrize ? 'bg-[#FFBD3A] border-none' : 'bg-transparent'} backdrop-blur-sm rounded-lg border border-[#636363] flex flex-col items-center justify-center text-center p-1 text-[11px] font-extrabold uppercase leading-none"
					style="width: {actualSquareSize}px; height: {actualSquareSize}px;"
				>
					{#if comp.hasPrize}
						<div class=" ">
							<div class="text-brand-dark">€{comp.prizeValue} PRIZE</div>
						</div>
					{:else}
						<div class="">
							<div class="text-[#636363]">NO PRIZE</div>
						</div>
					{/if}
					<p class="{comp.hasPrize ? 'text-brand-dark' : 'text-[#636363]'} text-[7px] font-thin">{comp.id}</p>
				</div>
			{/each}
		</div>

		<!-- Scratch Canvas -->
		<canvas
			bind:this={canvas}
			width={totalWidth}
			height={totalHeight}
			class="absolute left-0 top-0 cursor-pointer z-10 rounded-xl w-full h-full"
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:mouseleave={handleMouseUp}
			on:touchstart|preventDefault={handleTouchStart}
			on:touchmove|preventDefault={handleTouchMove}
			on:touchend|preventDefault={handleTouchEnd}
			on:touchcancel|preventDefault={handleTouchEnd}
		/>
	</div>
</div>