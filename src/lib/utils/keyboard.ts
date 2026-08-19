export function clampIndex(current: number, direction: 'up' | 'down', max: number): number {
	if (direction === 'up') return Math.max(0, current - 1);
	if (direction === 'down') return Math.min(max, current + 1);
	return current;
}
