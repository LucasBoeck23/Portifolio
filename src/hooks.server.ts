import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { url, request } = event;

	const referer = request.headers.get('Referer');
	let splashSkip = false;

	if (referer) {
		try {
			const refererUrl = new URL(referer);
			if (refererUrl.origin === url.origin) {
				splashSkip = true;
			}
		} catch {
			// invalid referer, ignore
		}
	}

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%splash-skip%', String(splashSkip))
	});
};
