export function getVariantForRoute(path: string): string {
	if (path === '/about') return 'about';
	if (path === '/resume') return 'resume';
	if (path === '/socials') return 'socials';
	return 'default';
}
