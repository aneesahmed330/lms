import { User } from '@app/manager/user/user.entity';

export interface ImportUserJobInterface {
  queryParameters: QueryParameters;
}

interface QueryParameters {
  currentUser: User;
  usersData: UserData[];
}

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  jobTitle: string;
  userStatus: string;
}
