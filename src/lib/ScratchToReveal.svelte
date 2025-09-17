<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let width: number = 300;
	export let height: number = 200;
	export let minScratchPercentage: number = 50;
	export let className: string = '';
	export let gradientColors: string[] = ['#A97CF8', '#F38CB8', '#FDCC92'];
	export let imageUrl: string | undefined = undefined;
	export let onComplete: (() => void) | undefined = undefined;

	const dispatch = createEventDispatcher<{
		complete: { percentage: number };
		scratchProgress: { percentage: number };
	}>();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isScratching = false;
	let isComplete = false;
	let animationId: number | null = null;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		ctx.globalCompositeOperation = 'source-over';
		
		if (imageUrl) {
			const img = new Image();
			img.onload = () => {
				ctx.drawImage(img, 0, 0, width, height);
			};
			img.src = imageUrl;
		} else {
			createGradientOverlay();
		}
		
		const handleDocumentMouseMove = (event: MouseEvent) => {
			if (!isScratching) return;
			scratch(event.clientX, event.clientY);
		};
		
		const handleDocumentTouchMove = (event: TouchEvent) => {
			if (!isScratching) return;
			const touch = event.touches[0];
			if (touch) {
				scratch(touch.clientX, touch.clientY);
			}
		};
		
		const handleDocumentMouseUp = () => {
			isScratching = false;
			checkCompletion();
		};
		
		const handleDocumentTouchEnd = () => {
			isScratching = false;
			checkCompletion();
		};
		
		document.addEventListener('mousemove', handleDocumentMouseMove);
		document.addEventListener('touchmove', handleDocumentTouchMove);
		document.addEventListener('mouseup', handleDocumentMouseUp);
		document.addEventListener('touchend', handleDocumentTouchEnd);
		document.addEventListener('touchcancel', handleDocumentTouchEnd);
		
		return () => {
			if (animationId) cancelAnimationFrame(animationId);
			document.removeEventListener('mousemove', handleDocumentMouseMove);
			document.removeEventListener('touchmove', handleDocumentTouchMove);
			document.removeEventListener('mouseup', handleDocumentMouseUp);
			document.removeEventListener('touchend', handleDocumentTouchEnd);
			document.removeEventListener('touchcancel', handleDocumentTouchEnd);
		};
	});

	function createGradientOverlay() {
		const gradient = ctx.createLinearGradient(0, 0, width, height);
		
		gradientColors.forEach((color, index) => {
			gradient.addColorStop(index / (gradientColors.length - 1), color);
		});
		
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
	}

	function handleMouseDown() {
		isScratching = true;
	}

	function handleTouchStart() {
		isScratching = true;
	}

	function scratch(clientX: number, clientY: number) {
		if (isComplete || !canvas || !ctx) return;

		const rect = canvas.getBoundingClientRect();
		const x = clientX - rect.left;
		const y = clientY - rect.top;

		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(x, y, 30, 0, Math.PI * 2);
		ctx.fill();
	}

	function checkCompletion() {
		if (isComplete) return;

		const imageData = ctx.getImageData(0, 0, width, height);
		const pixels = imageData.data;
		const totalPixels = pixels.length / 4;
		let clearPixels = 0;

		for (let i = 3; i < pixels.length; i += 4) {
			if (pixels[i] === 0) clearPixels++;
		}

		const percentage = (clearPixels / totalPixels) * 100;
		
		dispatch('scratchProgress', { percentage });

		if (percentage >= minScratchPercentage) {
			isComplete = true;
			ctx.clearRect(0, 0, width, height);
			dispatch('complete', { percentage });
			if (onComplete) onComplete();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			isComplete = true;
			ctx.clearRect(0, 0, width, height);
			dispatch('complete', { percentage: 100 });
			if (onComplete) onComplete();
		}
	}

	function generateScratchPath() {
		const points: Array<{x: number, y: number, radius: number, delay: number}> = [];
		const padding = 20;
		const rect = canvas.getBoundingClientRect();
		
		const numRows = 8;
		const rowHeight = (height - padding * 2) / numRows;
		
		for (let row = 0; row < numRows; row++) {
			const y = padding + row * rowHeight + Math.random() * 10;
			const startX = row % 2 === 0 ? padding : width - padding;
			const endX = row % 2 === 0 ? width - padding : padding;
			const numPoints = 15 + Math.floor(Math.random() * 5);
			
			for (let i = 0; i <= numPoints; i++) {
				const progress = i / numPoints;
				const x = startX + (endX - startX) * progress;
				
				const waveX = x + Math.sin(progress * Math.PI * 4) * 15;
				const waveY = y + Math.cos(progress * Math.PI * 3) * 8;
				
				const radius = 25 + Math.random() * 15;
				
				const delay = 8 + Math.random() * 4;
				
				points.push({
					x: rect.left + waveX,
					y: rect.top + waveY,
					radius,
					delay
				});
			}
			
			if (row % 3 === 0 && row < numRows - 1) {
				const centerX = rect.left + padding + Math.random() * (width - padding * 2);
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
		
		for (let i = 0; i < 20; i++) {
			points.push({
				x: rect.left + padding + Math.random() * (width - padding * 2),
				y: rect.top + padding + Math.random() * (height - padding * 2),
				radius: 35 + Math.random() * 15,
				delay: 10
			});
		}
		
		return points;
	}

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
			
			while (currentIndex < path.length && accumulatedTime >= path[currentIndex].delay) {
				const point = path[currentIndex];
				
				const rect = canvas.getBoundingClientRect();
				const x = point.x - rect.left;
				const y = point.y - rect.top;
				
				ctx.globalCompositeOperation = 'destination-out';
				ctx.beginPath();
				ctx.arc(x, y, point.radius, 0, Math.PI * 2);
				ctx.fill();
				
				accumulatedTime -= point.delay;
				currentIndex++;
				
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
				checkCompletion();
				if (!isComplete) {
					// If not complete, do a few more random scratches
					for (let i = 0; i < 30; i++) {
						const rect = canvas.getBoundingClientRect();
						const x = Math.random() * width;
						const y = Math.random() * height;
						
						ctx.globalCompositeOperation = 'destination-out';
						ctx.beginPath();
						ctx.arc(x, y, 40, 0, Math.PI * 2);
						ctx.fill();
					}
					checkCompletion();
				}
			}
		}
		
		animationId = requestAnimationFrame(animate);
	}

	export function reveal() {
		animateScratch();
	}

	export function reset() {
		if (animationId) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		isComplete = false;
		isScratching = false;
		
		if (imageUrl) {
			const img = new Image();
			img.onload = () => {
				ctx.clearRect(0, 0, width, height);
				ctx.globalCompositeOperation = 'source-over';
				ctx.drawImage(img, 0, 0, width, height);
			};
			img.src = imageUrl;
		} else {
			ctx.globalCompositeOperation = 'source-over';
			createGradientOverlay();
		}
	}
</script>

<div class="scratch-container {className}" style="width: {width}px; height: {height}px;">
	<div class="content">
		<slot />
	</div>
	<canvas
		bind:this={canvas}
		{width}
		{height}
		class="scratch-canvas"
		on:mousedown={handleMouseDown}
		on:touchstart|preventDefault={handleTouchStart}
		on:keydown={handleKeyDown}
		tabindex="0"
		role="button"
		aria-label="Scratch to reveal hidden content. Press Enter or Space to reveal all."
	/>
</div>

<style>
	.scratch-container {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.content {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scratch-canvas {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		cursor: grab;
		touch-action: none;
	}

	.scratch-canvas:active {
		cursor: grabbing;
	}

	.scratch-canvas:focus {
		outline: 2px solid #4A90E2;
		outline-offset: 2px;
	}
</style>