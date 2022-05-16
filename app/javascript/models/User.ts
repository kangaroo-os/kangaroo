export default interface User {
  id: number;
  fullName: string;
  email: string;
  client: string;
  accessToken: string;
  tokenExpiresAt: string;
}