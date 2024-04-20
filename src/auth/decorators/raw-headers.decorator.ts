import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (_, context: ExecutionContext):string[]=>{

        const { rawHeaders } =  context.switchToHttp().getRequest();
        return rawHeaders;
    }
)