import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const dashboard = await locals.pb.collection('dashboard').getOne('1');

	return {
		dashboard: dashboard
	};
};
