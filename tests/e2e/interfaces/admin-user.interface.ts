export interface AdminUserInterface {
  id: string;
  email: string | null;
  password: string | null;
  accessToken: string;
  refreshToken: string;
}
