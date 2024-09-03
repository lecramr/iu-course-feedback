import { generateNewTicketCreated } from '$lib/notificationBuilder';
import { addIncidentSchema } from '$lib/schema';
import { LexoRank } from 'lexorank';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const allCourses = await locals.pb.collection('courses').getFullList();
	const allMaterials = await locals.pb.collection('teaching_materials').getFullList();

	return {
		form: await superValidate(zod(addIncidentSchema)),
		courses: allCourses,
		materials: allMaterials
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(addIncidentSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const courseTeacher = (await event.locals.pb.collection('courses').getOne(form.data.courseId))
			.defaultTeacher;

		const latestLexoRank =
			(
				await event.locals.pb.collection('tickets').getList(1, 1, {
					sort: 'lexoRank'
				})
			)?.items.at(0)?.lexoRank ?? LexoRank.min().toString();

		const addedResult = await event.locals.pb.collection('tickets').create({
			title: form.data.title,
			body: form.data.description,
			author: event.locals.user!.id,
			course: form.data.courseId,
			status: 'New',
			material: form.data.materialId,
			assignee: courseTeacher,
			lexoRank: LexoRank.parse(latestLexoRank).between(LexoRank.max()).toString(),
			statusChange: new Date()
		});

		await event.locals.pb.collection('notifications').create(
			generateNewTicketCreated({
				ticketTitle: form.data.title,
				ticketId: addedResult.id,
				forUser: courseTeacher
			})
		);

		return {
			form,
			createdIssueId: addedResult.id
		};
	}
};
