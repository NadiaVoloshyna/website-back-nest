import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log(data);
    const request = ctx.switchToHttp().getRequest();
    const user =  request.user;
    return data ? user && user[data] : user;
  },
);

