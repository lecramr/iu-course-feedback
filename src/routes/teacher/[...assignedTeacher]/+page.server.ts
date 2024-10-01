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

	const grouped = groupBy(allTickets, 'status');

	const allTeachers = await locals.pb.collection('users').getFullList({
		filter: locals.pb.filter('type ~ {:type}', { type: 'teacher' })
	});

	return {
		tickets: grouped,
		allTeacher: allTeachers
	};
}) satisfies PageServerLoad;

type GroupedResult<T> = {
	[key: string]: T[];
};

function groupBy<T>(array: T[], key: keyof T): GroupedResult<T> {
	return array.reduce((result: GroupedResult<T>, currentValue: T) => {
		const groupKey = currentValue[key] as unknown as string; // Type assertion to string
		(result[groupKey] = result[groupKey] || []).push(currentValue);
		return result;
	}, {} as GroupedResult<T>);
}
