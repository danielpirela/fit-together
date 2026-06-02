export interface Couple {
  id: string;
  name: string;
  partnerAId: string;
  partnerBId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoupleParams {
  name: string;
  partnerAId: string;
}
