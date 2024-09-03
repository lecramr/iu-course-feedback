import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const allTickets = await locals.pb.collection('tickets').getFullList({
		sort: '-created',
		filter: locals.pb.filter('author ~ {:id}', { id: locals.user!.id })
	});

	return {
		tickets: allTickets
	};
}) satisfies PageServerLoad;
