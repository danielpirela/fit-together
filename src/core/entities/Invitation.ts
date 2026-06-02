// Invitation entity
export interface Invitation {
	id: string;
	coupleId: string;
	inviterId: string;
	inviteeEmail: string;
	status: InvitationStatus;
	token: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

// Invitation status
export type InvitationStatus = "pending" | "accepted" | "declined" | "expired";

// Create invitation DTO
export interface CreateInvitationDTO {
	coupleId: string;
	inviterId: string;
	inviteeEmail: string;
}

// Invitation with inviter info
export interface InvitationWithInviter extends Invitation {
	inviter: import("./User").User;
}
