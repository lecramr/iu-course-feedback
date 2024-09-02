import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return new Response(
		JSON.stringify({
			app: 'IU - Cource Feedback System',
			version: '0.1.0',
			message: 'Hello World'
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
