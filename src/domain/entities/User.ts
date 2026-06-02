export interface User {
  id: string;
  email: string;
  displayName: string;
  coupleId: string | null;
  role: 'partner_a' | 'partner_b' | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserParams {
  id: string;
  email: string;
  displayName: string;
}
