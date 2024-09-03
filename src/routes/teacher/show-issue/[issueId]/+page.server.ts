import {
	generateStatusChangeNotificationForStudent,
	generateStatusChangeNotificationForTeacher
} from '$lib/notificationBuilder';
import { addComment, editIncidentAsTeacherSchema } from '$lib/schema';
import type { RecordModel } from 'pocketbase';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
	const allCourses = await locals.pb.collection('courses').getFullList();
	const allMaterials = await locals.pb.collection('teaching_materials').getFullList();

	const allTeachers = await locals.pb.collection('users').getFullList({
		filter: locals.pb.filter('type ~ {:type}', { type: 'teacher' })
	});

	const requestedTicket = await locals.pb
		.collection('tickets')
		.getOne(params.issueId, { expand: 'assignee' });

	let allComments: RecordModel[] = [];
	if (requestedTicket.comments?.length > 0) {
		allComments = await locals.pb.collection('comments').getFullList({
			filter: requestedTicket.comments
				.map((id: string) => locals.pb.filter('id = {:id}', { id }))
				.join('||'),
			sort: '-created',
			expand: 'author'
		});
	}

	return {
		serverTicketForm: await superValidate(zod(editIncidentAsTeacherSchema), {
			defaults: {
				title: requestedTicket.title,
				description: requestedTicket.body,
				assigneeId: requestedTicket.assignee,
				courseId: requestedTicket.course,
				status: requestedTicket.status
			}
		}),
		serverCommentForm: await superValidate(zod(addComment)),
		ticket: requestedTicket,
		ticketComments: allComments,
		allTeacher: allTeachers,
		courses: allCourses,
		materials: allMaterials
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	updateticket: async (event) => {
		const form = await superValidate(event, zod(editIncidentAsTeacherSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const requestedTicket = await event.locals.pb
			.collection('tickets')
			.getOne(event.params.issueId);

		await event.locals.pb.collection('tickets').update(event.params.issueId, {
			title: form.data.title,
			body: form.data.description,
			course: form.data.courseId,
			assignee: form.data.assigneeId,
			status: form.data.status
		});

		if (requestedTicket.status != form.data.status) {
			await event.locals.pb.collection('notifications').create(
				generateStatusChangeNotificationForStudent({
					ticketTitle: form.data.title,
					ticketId: event.params.issueId,
					forUser: requestedTicket.author
				})
			);

			if (requestedTicket.assignee != event.locals.user?.id) {
				await event.locals.pb.collection('notifications').create(
					generateStatusChangeNotificationForTeacher({
						ticketTitle: form.data.title,
						ticketId: event.params.issueId,
						forUser: requestedTicket.assignee
					})
				);
			}
		}

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
			isInternal: form.data.isInternal
		});

		await event.locals.pb.collection('tickets').update(event.params.issueId, {
			'comments+': createdComment.id
		});

		return {
			form
		};
	}
};
