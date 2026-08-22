import { clampIndex } from './keyboard';

export function useKeyboardNav(options: {
	itemCount: number;
	onBack?: () => void;
}) {
	let active = $state(-1);
	let mounted = $state(false);

	$effect(() => {
		const timer = setTimeout(() => (mounted = true), 60);
		return () => clearTimeout(timer);
	});

	function handleKey(key: string): boolean {
		if (key === 'ArrowUp' || key === 'ArrowDown') {
			active = clampIndex(active, key === 'ArrowUp' ? 'up' : 'down', options.itemCount - 1);
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
