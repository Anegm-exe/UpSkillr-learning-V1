
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = 
(...roles: Role[]) =>SetMetadata(ROLES_KEY, roles);
export enum Role {
  Student = 'student',
  Admin = 'admin',
  Instructor = 'instructor'
}
  