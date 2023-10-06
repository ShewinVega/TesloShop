import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {


  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configServices: ConfigService
  ){
    super({
      secretOrKey: configServices.get<string>('jwtSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate( payload: JwtPayload ): Promise<User> {

    const { id } = payload;

    const data = await this.userRepository.findOne({
      where: {id}
    })

    if(!data)
      throw new UnauthorizedException(`Token no valid`);

    if ( !data.isActive )
      throw new UnauthorizedException(`User is inactive!. Contact the Teslo support in order to help you with your issue`);


    return data;
  }

}