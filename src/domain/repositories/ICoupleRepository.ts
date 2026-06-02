import type { Couple, CreateCoupleParams } from '../entities';

export interface ICoupleRepository {
  getByUserId(userId: string): Promise<Couple | null>;
  create(params: CreateCoupleParams): Promise<Couple>;
  update(id: string, data: Partial<Couple>): Promise<Couple>;
}
