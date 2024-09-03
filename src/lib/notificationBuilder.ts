export type statusChange = {
	ticketTitle: string;
	ticketId: string;
	forUser: string;
};

export type newTicket = {
	ticketTitle: string;
	ticketId: string;
	forUser: string;
};

export function generateStatusChangeNotificationForStudent(status: statusChange) {
	return {
		title: 'Der Status eines Tickets wurde aktualisiert!',
		body: `Der Status des Tickets '<a href="/student/show-issue/${status.ticketId}">${status.ticketTitle}</a>' wurde aktualisiert!`,
		forUser: status.forUser
	};
}

export function generateStatusChangeNotificationForTeacher(status: statusChange) {
	return {
		title: 'Der Status eines Tickets wurde aktualisiert!',
		body: `Der Status des Tickets '<a href="/teacher/show-issue/${status.ticketId}">${status.ticketTitle}</a>' wurde aktualisiert!`,
		forUser: status.forUser
	};
}

export function generateNewTicketCreated(status: newTicket) {
	return {
		title: 'Es wurde ein neues Ticket erstellt!',
		body: `Es wurde ein neues Ticket erstellt '<a href="/teacher/show-issue/${status.ticketId}">${status.ticketTitle}</a>' und Ihnen zugewiesen!`,
		forUser: status.forUser
	};
}
