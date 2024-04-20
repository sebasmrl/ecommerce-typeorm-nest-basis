import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data:string,  context: ExecutionContext)=>{
        //console.log({data}) //data es infoRmacion que se le pasa como param a la anotacion
        const req =  context.switchToHttp().getRequest();
        const user = req.user;

        if(!user) 
            throw new InternalServerErrorException('User not found (request)');

        return (!data)
            ? user 
            : user[data.toLowerCase().trim()];
    }
);