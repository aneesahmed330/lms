import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export class UserAssignedToRequest {
  userId: number;
}
export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserAssignedToRequest => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
