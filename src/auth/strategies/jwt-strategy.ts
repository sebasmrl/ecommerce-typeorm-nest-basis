import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { JWTPayload } from "../interfaces";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { User } from "../entities/user.entity";


@Injectable() //add to providers and exports in module fie
export class JwtStrategy extends PassportStrategy(Strategy){
    //La estrategia es para dar seguridad a los endpoints

    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>, 
        configService: ConfigService
    ){
        super({ 
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }


    //se llamara cuando el jwt no haya expirado y la firma hace match con el payload
    async validate(payload:JWTPayload): Promise<User>{
        const { email } = payload;

        const user  = await this.userRepository.findOneBy({email});
        if(!user) throw new UnauthorizedException('Token os not valid')    

        if(!user.isActive) throw new UnauthorizedException('User is inactive')    
       
        return user; //lo que se retorna se añade a la request
    }
} 