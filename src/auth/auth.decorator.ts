import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // 데코레이터를 통해 유저정보를 사용할 수 있도록 반환
    return request.user;
  },
);
