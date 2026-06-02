// Couple entity - represents a partnership between two users
export interface Couple {
  id: string;
  name: string;
  partnerAId: string;
  partnerBId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create couple DTO
export interface CreateCoupleDTO {
  name: string;
  partnerAId: string;
  partnerBId: string;
}

// Couple with users
export interface CoupleWithUsers extends Couple {
  partnerA: import("./User").User;
  partnerB: import("./User").User;
}

// Couple member info
export interface CoupleMember {
  userId: string;
  displayName: string;
  role: "partner_a" | "partner_b";
}