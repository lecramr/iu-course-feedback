import { addComment, editIncidentSchema } from '$lib/schema';
import type { RecordModel } from 'pocketbase';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const allCourses = await locals.pb.collection('courses').getFullList();
	const allMaterials = await locals.pb.collection('teaching_materials').getFullList();

	const requestedTicket = await locals.pb
		.collection('tickets')
		.getOne(params.issueId, { expand: 'assignee' });

	let allComments: RecordModel[] = [];
	if (requestedTicket.comments?.length > 0) {
		allComments = await locals.pb.collection('comments').getFullList({
			filter:
				requestedTicket.comments
					.map((id: string) => locals.pb.filter('id = {:id}', { id }))
					.join('||') +
				' ' +
				locals.pb.filter('&& isInternal ~ false'),
			sort: '-created',
			expand: 'author'
		});
	}

	return {
		form: await superValidate(zod(editIncidentSchema), {
			defaults: {
				title: requestedTicket.title,
				description: requestedTicket.body
			}
		}),
		commentForm: await superValidate(zod(addComment)),
		ticket: requestedTicket,
		ticketComments: allComments,
		courses: allCourses,
		materials: allMaterials
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateticket: async (event) => {
		const form = await superValidate(event, zod(editIncidentSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await event.locals.pb.collection('tickets').update(event.params.issueId, {
			title: form.data.title,
			body: form.data.description
		});

		return {
			form
		};
	},
	addcomment: async (event) => {
		const form = await superValidate(event, zod(addComment));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const createdComment = await event.locals.pb.collection('comments').create({
			body: form.data.body,
			author: event.locals.user!.id,
			isInternal: false
		});

		await event.locals.pb.collection('tickets').update(event.params.issueId, {
			'comments+': createdComment.id
		});

		return {
			form
		};
	}
};
