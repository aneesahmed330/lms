import { IActiveUserData } from '@app/modules/auth/interface/active-user-data.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export class UserAssignedToRequest {
  userId: number;
}
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): IActiveUserData => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
