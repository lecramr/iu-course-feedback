import type { RecordModel } from 'pocketbase';
import type { LayoutServerLoad } from './$types';

// Load this data everywhere
export const load: LayoutServerLoad = async ({ locals }) => {
	let notifications: RecordModel[] = [];
	if (locals.user?.id) {
		notifications = await locals.pb.collection('notifications').getFullList({
			filter: locals.pb.filter('forUser ~ {:id}', { id: locals.user!.id })
		});
	}

	return {
		user: locals.user,
		notifications: notifications.sort((a, b) => (a.created > b.created ? -1 : 1))
	};
};
