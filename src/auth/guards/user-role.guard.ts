import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector, // Reflector allow us to catch data or in this case information from decorators or metadata
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // create variable that get the metadata from ou method
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());


    // we are going to check if validRoles is empty
    if(!validRoles) return true;
    

    const req = context.switchToHttp().getRequest();
    const user: User = req.user; // or this could be in this form: const user = req.user as User

    if ( !user ) 
      throw new BadRequestException(`User not Found!`);
       
    
    for (const item of user.roles) {
      if ( validRoles.includes(item) ) {
        return true;
      }
    }

    throw new ForbiddenException(` User ${ user.fullName } needs to has a valid role!`);
  }
}
