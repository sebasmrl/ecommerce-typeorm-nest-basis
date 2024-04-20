import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private  readonly reflector: Reflector, //permite ver informacion de metadata de donde se este llamando
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const req = context.switchToHttp().getRequest();
    const validRoles:string[] = this.reflector.get('roles', context.getHandler());

    if(!validRoles) return true; // sin el array, cualquier usuario puede entrar
    if(validRoles.length===0) return true; // con el arreglo  pero vacio

    const user:User = req.user;
    if(!user) throw new InternalServerErrorException('User not found')
    console.log('UserRoleGuard', {validRoles})
    
    if(validRoles.filter( role=> user.roles.includes(role)).length >0 ) return true
    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${ validRoles }]`)
  }
}
