import { clampIndex } from './keyboard';

export function useKeyboardNav(options: {
	itemCount: number;
	onBack?: () => void;
	onSelect?: (index: number) => void;
}) {
	let active = $state(-1);
	let mounted = $state(false);

	$effect(() => {
		const timer = setTimeout(() => (mounted = true), 60);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		function onKeydown(e: KeyboardEvent) {
			if (handleKey(e.key)) {
				e.preventDefault();
			}
		}

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	function handleKey(key: string): boolean {
		if (key === 'ArrowUp' || key === 'ArrowDown') {
			active = clampIndex(active, key === 'ArrowUp' ? 'up' : 'down', options.itemCount - 1);
			return true;
		}
		if (key === 'Enter' && active >= 0 && options.onSelect) {
			options.onSelect(active);
			return true;
		}
		if ((key === 'Escape' || key === 'Backspace') && options.onBack) {
			options.onBack();
			return true;
		}
		return false;
	}

	return {
		get active() { return active; },
		set active(v: number) { active = v; },
		get mounted() { return mounted; },
		handleKey,
	};
}
