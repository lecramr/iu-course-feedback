import {
	generateStatusChangeNotificationForStudent,
	generateStatusChangeNotificationForTeacher
} from '$lib/notificationBuilder';
import type { RequestHandler } from '@sveltejs/kit';
import { LexoRank } from 'lexorank';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body = (await request.json()) as {
		ticketId: string;
		newStatus: string;
		beforeItemLexorank: string | undefined;
		afterItemLexorank: string | undefined;
	};

	const beforeLexo = body.beforeItemLexorank
		? LexoRank.parse(body.beforeItemLexorank)
		: LexoRank.min();
	const afterLexo = body.afterItemLexorank
		? LexoRank.parse(body.afterItemLexorank)
		: LexoRank.max();

	const newLexoRank = beforeLexo.between(afterLexo);

	await locals.pb.collection('tickets').update(body.ticketId, {
		status: body.newStatus,
		lexoRank: newLexoRank.toString(),
		statusChange: new Date()
	});

	const updatedTicket = await locals.pb.collection('tickets').getOne(body.ticketId);

	await locals.pb.collection('notifications').create(
		generateStatusChangeNotificationForStudent({
			ticketTitle: updatedTicket.title,
			ticketId: body.ticketId,
			forUser: updatedTicket.author
		})
	);

	if (updatedTicket.assignee != locals.user?.id) {
		await locals.pb.collection('notifications').create(
			generateStatusChangeNotificationForTeacher({
				ticketTitle: updatedTicket.title,
				ticketId: body.ticketId,
				forUser: updatedTicket.assignee
			})
		);
	}

	return new Response();
};
