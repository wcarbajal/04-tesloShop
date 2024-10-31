import { BadRequestException, createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const RowHeaders  = createParamDecorator(
  (  ctx: ExecutionContext ) => {

    

    const request = ctx.switchToHttp().getRequest();
    const rawHeaders = request.rawHeaders;
    


    return rawHeaders
  }
);