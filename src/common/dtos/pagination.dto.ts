import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @Type( ()=> Number )  //enableImplicitConvertions:true
    limit?:number;
    
    @IsOptional()
    @Min(0)
    @Type( ()=> Number )  //enableImplicitConvertions:true
    offset?:number;
}