import type { LayoutServerLoad } from './$types';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user
	};
};
