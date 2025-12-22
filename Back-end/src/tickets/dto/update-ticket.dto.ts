export class UpdateTicketDto {
	title?: string;
	description?: string;
	priority?: string; // aligns loosely; backend validates at DB level
	relatedSystem?: string;
	assignmentGroupId?: string | null;
	assignedToId?: string | null;
}
