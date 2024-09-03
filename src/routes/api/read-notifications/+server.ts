import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const notifications = await locals.pb.collection('notifications').getFullList({
		filter: locals.pb.filter('forUser ~ {:id} && isRead = false', { id: locals.user!.id })
	});

	notifications.forEach(async (x) => {
		await locals.pb.collection('notifications').update(x.id, {
			isRead: true
		});
	});

	return new Response();
};
