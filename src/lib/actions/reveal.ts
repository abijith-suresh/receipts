/**
 * Svelte action that uses IntersectionObserver to add a 'revealed' class
 * when the element enters the viewport. Works with the global [data-reveal]
 * CSS rules in layout.css.
 *
 * Usage:
 *   <div use:reveal>...</div>
 *   <div use:reveal={{ rootMargin: '0px 0px -48px 0px' }}>...</div>
 */
export function reveal(node: Element, options?: { rootMargin?: string }) {
	const rootMargin = options?.rootMargin ?? '0px 0px -20px 0px';

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.1, rootMargin },
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		},
	};
}
