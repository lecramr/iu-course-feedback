import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.user) {
		if (locals.user.type == 'student') {
			throw redirect(302, 'student');
		} else if (locals.user.type == 'teacher') {
			throw redirect(302, 'teacher');
		}
	} else {
		throw redirect(302, 'system-overview');
	}
}) satisfies PageServerLoad;
