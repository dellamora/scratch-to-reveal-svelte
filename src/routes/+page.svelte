<script lang="ts">
	import ScratchToReveal from '$lib/ScratchToReveal.svelte';
	import { onMount } from 'svelte';
	import Prism from 'prismjs';
	import 'prismjs/components/prism-markup-templating.js';
	import 'prismjs/components/prism-javascript.js';
	import 'prismjs/components/prism-bash.js';

	let revealProgress = 0;
	let isComplete = false;
	let scratchComponent: ScratchToReveal;

	function handleScratchProgress(event: CustomEvent<{ percentage: number }>) {
		revealProgress = Math.round(event.detail.percentage);
	}

	function handleComplete(event: CustomEvent<{ percentage: number }>) {
		isComplete = true;
		console.log('Complete!', event.detail.percentage);
	}

	function autoReveal() {
		if (isComplete) {
			scratchComponent.reset();
			isComplete = false;
			revealProgress = 0;
		} else {
			scratchComponent.reveal();
		}
	}

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	}

	onMount(() => {
		Prism.highlightAll();
	});
</script>

<svelte:head>
	<title>Scratch to Reveal · Svelte Component</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
	<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
</svelte:head>

<div class="page-wrapper">
	<main>
		<header>
			<div class="hero">
				<h1 class="title">Scratch to Reveal</h1>
				<a class="subtitle" href="https://github.com/dellamora/scratch-to-reveal">Here's the repo</a>
			</div>
		</header>

		<section class="playground">
			<div class="playground-header">
				<h2>Try it yourself</h2>
				<div class="progress-indicator">
					<span class="progress-label">Progress</span>
					<span class="progress-value">{revealProgress}%</span>
				</div>
			</div>
			
			<div class="scratch-container">
				<ScratchToReveal
					bind:this={scratchComponent}
					width={320}
					height={320}
					minScratchPercentage={50}
					className="scratch-card"
					gradientColors={["#f1f5f9", "#cbd5e1", "#94a3b8"]}
					on:scratchProgress={handleScratchProgress}
					on:complete={handleComplete}
				>
					<div class="hidden-content">
						<span>^•ﻌ•^ฅ♡</span>
					</div>
				</ScratchToReveal>
				
				{#if isComplete}
					<div class="complete-badge">✨ Revealed!</div>
				{/if}
			</div>
			
			<button 
				on:click={autoReveal}
				class="reveal-button"
			>
				{isComplete ? 'Try again' : 'Reveal All'}
			</button>
		</section>
		<section class="installation">
			<h2>Installation</h2>
			<div class="code-block">
				<button 
					class="copy-button" 
					on:click={() => copyToClipboard('npm install scratch-to-reveal-svelte')}
					aria-label="Copy installation command"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
				</button>
				<pre class="bg"><code class="language-bash">npm install scratch-to-reveal-svelte</code></pre>
			</div>
		</section>

		<section class="usage">
			<h2>Usage</h2>
			<div class="code-block">
				<button 
					class="copy-button" 
					on:click={() => copyToClipboard(`<script>
  import ScratchToReveal from 'scratch-to-reveal-svelte';
</script>

<ScratchToReveal 
  width={320}
  height={320}
  minScratchPercentage={70}
  gradientColors={["#FF6B6B", "#FFA500", "#FFD700"]}
  on:complete={() => console.log('Revealed!')}
>
  <div>Your hidden content here!</div>
</ScratchToReveal>`)}
					aria-label="Copy usage code"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
						<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
					</svg>
				</button>
				<pre class="bg"><code class="language-markup">&lt;script&gt;
  import ScratchToReveal from 'scratch-to-reveal-svelte';
&lt;/script&gt;

&lt;ScratchToReveal 
  width={320}
  height={320}
  minScratchPercentage={70}
  gradientColors={["#FF6B6B", "#FFA500", "#FFD700"]}
  on:complete={() => console.log('Revealed!')}
&gt;
  &lt;div&gt;Your hidden content here!&lt;/div&gt;
&lt;/ScratchToReveal&gt;</code></pre>
			</div>
		</section>
	</main>

	<footer>
		<div class="footer-content">
			<div class="footer-info">
				<p class="footer-name">Made with ♥ by Francielle Dellamora</p>
			</div>
			<div class="social-links">
				<a target="_blank" href="https://github.com/dellamora" aria-label="GitHub">
					<svg width="20px" height="20px" viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M13 31.1909C5.11667 33.7576 5.11667 26.6076 2 25.6909" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
						<path d="M24 34.8576V28.4409C24 26.6076 24.1834 25.8742 23.0834 24.7742C28.2167 24.2242 33.1667 22.2076 33.1667 13.7742C33.1645 11.5833 32.3097 9.47931 30.7833 7.90758C31.4992 6.00452 31.4333 3.89556 30.6 2.04091C30.6 2.04091 28.5834 1.49091 24.1833 4.42424C20.4566 3.45365 16.5434 3.45366 12.8167 4.42425C8.41665 1.49091 6.40002 2.04091 6.40002 2.04091C5.56674 3.89556 5.5008 6.00451 6.21665 7.90758C4.69032 9.47931 3.83561 11.5833 3.83337 13.7742C3.83337 22.2076 8.78337 24.2242 13.9167 24.7742C12.8167 25.8742 12.8166 26.9742 12.9999 28.4409L13 34.8576" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</a>
				<a target="_blank" href="https://twitter.com/francidellamora" aria-label="Twitter">
					<svg width="22px" height="20px" viewBox="0 0 41 33" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M38.6667 2.20277C36.8333 3.1011 35.0367 3.46593 33.1667 4.01777C31.1115 1.6986 28.0645 1.57027 25.1367 2.6666C22.2088 3.76293 20.2912 6.44327 20.3333 9.51777V11.3511C14.3842 11.5033 9.08583 8.7936 5.66667 4.01777C5.66667 4.01777 -2.00033 17.6449 13 24.1844C9.568 26.4706 6.14517 28.0124 2 27.8511C8.06467 31.1566 14.6738 32.2933 20.3957 30.6323C26.959 28.7256 32.3527 23.8068 34.4225 16.4386C35.0399 14.1977 35.3465 11.8825 35.3337 9.5581C35.33 9.1016 38.102 4.4761 38.6667 2.20093V2.20277Z" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"></path>
					</svg>
				</a>
				<a target="_blank" href="https://www.buymeacoffee.com/dellamora" aria-label="Buy me a coffee">
					<svg xmlns="http://www.w3.org/2000/svg" width="26px" height="26px" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
						<path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"></path>
						<path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
						<path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path>
						<path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z"></path>
						<path d="M16.746 16.726a3 3 0 1 0 .252 -5.555"></path>
					</svg>
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		background: #ffffff;
		color: #0f172a;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.page-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	main {
		flex: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 4rem 2rem;
		width: 100%;
	}

	header {
		margin-bottom: 8rem;
		text-align: center;
	}

	.hero {
		max-width: 800px;
		margin: 0 auto;
	}

	.title {
		font-size: clamp(3rem, 8vw, 5.5rem);
		font-weight: 900;
		margin: 0 0 1.5rem 0;
		letter-spacing: -0.04em;
		color: #0f172a;
		line-height: 0.9;
	}

	.subtitle {
		font-size: 1.25rem;
		color: #64748b;
		font-weight: 400;
		margin: 0;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.5;
	}

	.playground {
		margin: 8rem 0;
		padding: 4rem;
		background: #f8fafc;
		border-radius: 32px;
		border: 1px solid #e2e8f0;
	}

	.playground-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 3rem;
	}

	.playground-header h2 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: #0f172a;
		letter-spacing: -0.02em;
	}

	.progress-indicator {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1.5rem;
		background: white;
		border-radius: 50px;
		font-size: 0.875rem;
		border: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.progress-label {
		color: #64748b;
		font-weight: 500;
	}

	.progress-value {
		font-weight: 700;
		color: #0f172a;
		min-width: 3ch;
		text-align: right;
	}
	.bg {
		background: #0f172a;
	}
	.scratch-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 3rem;
		padding: 2rem 0;
	}

	:global(.scratch-card) {
		border-radius: 24px;
		overflow: hidden;
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		border: 1px solid #e2e8f0;
	}

	.hidden-content {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		text-align: center;
		font-size: 4rem;
		color: #475569;
	}

	.complete-badge {
		position: absolute;
		top: -1rem;
		right: -1rem;
		background: #0f172a;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		font-size: 0.875rem;
		font-weight: 600;
		animation: pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	@keyframes pop {
		0% { 
			transform: scale(0) rotate(-10deg);
			opacity: 0;
		}
		50% { 
			transform: scale(1.1) rotate(5deg);
			opacity: 1;
		}
		100% { 
			transform: scale(1) rotate(0deg);
			opacity: 1;
		}
	}

	.reveal-button {
		display: block;
		margin: 0 auto;
		padding: 1.125rem 2.5rem;
		background: #0f172a;
		color: white;
		border: none;
		border-radius: 50px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 14px 0 rgba(15, 23, 42, 0.2);
		letter-spacing: -0.01em;
	}

	.reveal-button:hover {
		transform: translateY(-2px);
		background: #1e293b;
		box-shadow: 0 8px 25px 0 rgba(15, 23, 42, 0.3);
	}

	.reveal-button:active {
		transform: translateY(0);
	}

	.installation,
	.usage {
		margin: 8rem 0;
	}

	.installation h2,
	.usage h2 {
		font-size: 2.25rem;
		font-weight: 800;
		margin: 0 0 2rem 0;
		color: #0f172a;
		letter-spacing: -0.02em;
	}

	.code-block {
		background: #0f172a;
		border: none;
		border-radius: 16px;
		padding: 2rem;
		overflow-x: auto;
		position: relative;
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}

	.copy-button {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 0.625rem;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #94a3b8;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		z-index: 10;
		backdrop-filter: blur(8px);
	}

	.copy-button:hover {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border-color: rgba(255, 255, 255, 0.3);
		transform: scale(1.05);
	}

	.copy-button:active {
		transform: scale(0.95);
	}

	.code-block code,
	.code-block pre {
		font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
		font-size: 0.9rem;
		line-height: 1.7;
		margin: 0;
		white-space: pre;
		color: #e2e8f0;
	}

	/* Custom Prism theme to match our dark blue design */
	:global(.code-block .token.comment),
	:global(.code-block .token.prolog),
	:global(.code-block .token.doctype),
	:global(.code-block .token.cdata) {
		color: #64748b;
		font-style: italic;
	}

	:global(.code-block .token.punctuation) {
		color: #cbd5e1;
	}

	:global(.code-block .token.property),
	:global(.code-block .token.tag),
	:global(.code-block .token.boolean),
	:global(.code-block .token.number),
	:global(.code-block .token.constant),
	:global(.code-block .token.symbol),
	:global(.code-block .token.deleted) {
		color: #f87171;
	}

	:global(.code-block .token.selector),
	:global(.code-block .token.attr-name),
	:global(.code-block .token.string),
	:global(.code-block .token.char),
	:global(.code-block .token.builtin),
	:global(.code-block .token.inserted) {
		color: #34d399;
	}

	:global(.code-block .token.operator),
	:global(.code-block .token.entity),
	:global(.code-block .token.url),
	:global(.code-block .language-css .token.string),
	:global(.code-block .style .token.string) {
		color: #60a5fa;
	}

	:global(.code-block .token.atrule),
	:global(.code-block .token.attr-value),
	:global(.code-block .token.keyword) {
		color: #a78bfa;
	}

	:global(.code-block .token.function),
	:global(.code-block .token.class-name) {
		color: #fbbf24;
	}

	:global(.code-block .token.regex),
	:global(.code-block .token.important),
	:global(.code-block .token.variable) {
		color: #fb7185;
	}

	:global(.code-block .token.important),
	:global(.code-block .token.bold) {
		font-weight: bold;
	}

	:global(.code-block .token.italic) {
		font-style: italic;
	}

	footer {
		background: #0f172a;
		color: #e2e8f0;
		margin-top: 8rem;
		padding: 4rem 2rem;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.footer-info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.footer-name {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		color: white;
	}

	.social-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.social-links a {
		color: #94a3b8;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
	}

	.social-links a:hover {
		transform: translateY(-2px);
		color: white;
		background: rgba(255, 255, 255, 0.1);
	}

	@media (max-width: 768px) {
		main {
			padding: 2rem 1rem;
		}

		header {
			margin-bottom: 4rem;
		}

		.playground {
			padding: 2rem;
			margin: 4rem 0;
			border-radius: 24px;
		}

		.playground-header {
			flex-direction: column;
			gap: 1.5rem;
			align-items: stretch;
			text-align: center;
		}

		.playground-header h2 {
			font-size: 1.5rem;
		}

		.progress-indicator {
			justify-content: center;
		}

		.installation,
		.usage {
			margin: 4rem 0;
		}

		.installation h2,
		.usage h2 {
			font-size: 1.875rem;
		}

		.footer-content {
			flex-direction: column;
			text-align: center;
		}

		.social-links {
			justify-content: center;
		}
	}

	@media (max-width: 480px) {
		.code-block {
			padding: 1.5rem;
		}

		.copy-button {
			top: 1rem;
			right: 1rem;
			width: 36px;
			height: 36px;
		}

		.hidden-content {
			font-size: 2.5rem;
		}

		.title {
			font-size: 2.5rem;
		}

		.scratch-container {
			padding: 1rem 0;
		}
	}
</style>