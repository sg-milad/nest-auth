import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role.enum';

export const HasRoles = (...roles: Role[]) => SetMetadata('roles', roles);
