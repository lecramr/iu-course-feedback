import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	//Minus 14 Days in MS
	const beforeForteenDays = new Date(Date.now() - 12096e5);

	const allTickets = await locals.pb.collection('tickets').getFullList({
		sort: 'lexoRank',
		expand: 'assignee,course',
		filter: locals.pb.filter(
			'assignee ~ {:id} && (((status ~ "Abgelehnt") || (status ~ "Abgeschlossen") && statusChange > {:beforeForteenDays}) || status ~ "Neu" || status ~ "In Prüfung" || status ~ "In Bearbeitung")',
			{
				id: params.assignedTeacher,
				beforeForteenDays
			}
		)
	});

	const grouped = Object.groupBy(allTickets, ({ status }) => status);

	const allTeachers = await locals.pb.collection('users').getFullList({
		filter: locals.pb.filter('type ~ {:type}', { type: 'teacher' })
	});

	return {
		tickets: grouped,
		allTeacher: allTeachers
	};
}) satisfies PageServerLoad;
