import { render, screen } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import ScratchToReveal from './ScratchToReveal.svelte';

describe('ScratchToReveal', () => {
	it('renders canvas with correct dimensions', () => {
		const { container } = render(ScratchToReveal, {
			props: {
				width: 300,
				height: 200
			}
		});
		
		const canvas = container.querySelector('canvas');
		expect(canvas).toBeInTheDocument();
		expect(canvas).toHaveAttribute('width', '300');
		expect(canvas).toHaveAttribute('height', '200');
	});

	it('has correct accessibility attributes', () => {
		const { container } = render(ScratchToReveal, {
			props: {
				width: 300,
				height: 200
			}
		});
		
		const canvas = container.querySelector('canvas');
		expect(canvas).toHaveAttribute('role', 'button');
		expect(canvas).toHaveAttribute('tabindex', '0');
		expect(canvas).toHaveAttribute('aria-label');
	});

	it('renders slot content', () => {
		const { container } = render(ScratchToReveal, {
			props: {
				width: 300,
				height: 200
			}
		});
		
		const contentDiv = container.querySelector('.content');
		expect(contentDiv).toBeInTheDocument();
	});
});