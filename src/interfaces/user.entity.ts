import { Role } from '../constants/role.enum';

export interface IUser {
  userId: number;
  username: string;
  password: string;
  roles: Role[];
}
