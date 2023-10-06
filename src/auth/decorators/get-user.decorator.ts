import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";



export const GetUser = createParamDecorator(
  ( data, ctx: ExecutionContext ) => {

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    

    if (data === 'email') {
      return {
        email: user.email,
      }
    }
    

    if ( !user )
      throw new InternalServerErrorException(`User not found! (request)`);

    return user;
  }
)