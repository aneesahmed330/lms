import { IActiveUserData } from '@app/modules/auth/interface/active-user-data.interface';
import { Request } from 'express';

export interface IRequest extends Request {
  user: IActiveUserData; // Add the custom `user` property
}
