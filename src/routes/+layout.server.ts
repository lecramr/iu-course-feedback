import type { LayoutServerLoad } from './$types';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: locals.pb.filter('forUser ~ {:id}', { id: locals.user!.id })
	});

	return {
		user: locals.user,
		notifications: notifications
	};
};