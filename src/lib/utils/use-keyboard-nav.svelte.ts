export function useKeyboardNav(options: {
	itemCount: number;
	onBack?: () => void;
}) {
	let active = $state(0);
	let mounted = $state(false);

	$effect(() => {
		const timer = setTimeout(() => (mounted = true), 60);
		return () => clearTimeout(timer);
	});

	function handleKey(key: string): boolean {
		if (key === 'ArrowUp') {
			active = Math.max(0, active - 1);
			return true;
		}
		if (key === 'ArrowDown') {
			active = Math.min(options.itemCount - 1, active + 1);
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
