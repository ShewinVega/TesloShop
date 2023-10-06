import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginDto } from './dto/index';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  private readonly Logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtServices: JwtService
  ){}


  /**
   * The above function creates a new user by encrypting the password, saving the user data in the
   * database, and returning the user object without the password.
   * @param {CreateUserDto} createUserDto - The `createUserDto` is an object that contains the data
   * needed to create a new user. It typically includes properties such as `username`, `email`, and
   * `password`.
   * @returns the userResponse object, which is the user data without the password field.
   */
  async create(createUserDto: CreateUserDto) {
    
    try {
      
      const { password, ...userData } = createUserDto;

      // encript my password
      const passwordHash = bcrypt.hashSync(password,10);

      // building the environment in ordfer to save user in the database
      const userResponse = this.userRepository.create({ ...userData, password:passwordHash });
      
      // register user in the database
      await this.userRepository.save(userResponse);
      delete userResponse.password;

      return {
        ...userResponse,
        token: this.getJwtToken({ id: userResponse.id })
      }

    } catch (error) {
      this.Logger.error(`There was an error in register User: ${error}`);
      this.handleErrors(error);
    }

  }


  async signing(loginDto: LoginDto) {
    
    const { email, password } = loginDto;

    // validate if user exist
    const userResponse = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    // throwing error if user does not exist
    if(!userResponse) 
      throw new UnauthorizedException(`User with this email: ${email} not found!`);

    // testing if password request and password reponse are the same using bcrypt
    const isSame: boolean = bcrypt.compareSync(password,userResponse.password);

    if(!isSame)
      throw new UnauthorizedException(`Credentials are not valid!`);

    return {
      ...userResponse,
      token: this.getJwtToken({ id: userResponse.id }) 
    }
  }


  async checkAuthStatus(user:User) {

    const { id, fullName, email, ...restOfUser } = user

    return {
      id,
      fullName,
      email,
      token: this.getJwtToken({ id })
    }
    
  }


  /**
   * The function `getJwtToken` generates a JWT token by signing the provided payload using a JWT
   * service.
   * @param {JwtPayload} payload - The `payload` parameter is an object that contains the data that
   * will be encoded into the JWT (JSON Web Token). This data can include information such as the
   * user's ID, username, and any other relevant information that needs to be included in the token.
   * @returns a JWT token.
   */
  private getJwtToken( payload: JwtPayload ) {
    const token = this.jwtServices.sign( payload );
    return token;
  }

  /**
   * The function handles errors by checking for a specific error code and throwing appropriate
   * exceptions.
   * @param {any} error - The `error` parameter is of type `any`, which means it can be any type of
   * error object.
   */
  private handleErrors( error: any ): never {
    if(error.code === '23505') 
      throw new BadRequestException(`this email has been used!`);

    throw new InternalServerErrorException(`There was an expected error. you have to check the logs`)
  }


}
