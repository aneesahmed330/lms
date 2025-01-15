import { CreateUserDto } from '../RequestableDTOs';
import { UserRole } from '../constants';

export const AdminUsersData: CreateUserDto[] = [
  {
    email: 'zahid.raiz@lms.com',
    password: '12345678',
    firstName: 'Zahid',
    lastName: 'Riaz',
    userRole: UserRole.Admin,
  },
  {
    email: 'anees.ahmed@lms.com',
    password: '12345678',
    firstName: 'Anees',
    lastName: 'Ahmed',
    userRole: UserRole.Admin,
  },
];
