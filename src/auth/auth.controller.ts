import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from './dto/index';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { Auth, RoleProtected, RawHeaders, GetUser } from './decorators';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description:`User created`, type: User })
  @ApiResponse({ status: 400, description: `the information got it is not the appropriate` })
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  @Post('signing')
  @ApiResponse({ status: 201, description:`User created`, })
  @ApiResponse({status:404, description:`User credentials not found`})
  signing( @Body() loginDto: LoginDto) {
    return this.authService.signing(loginDto);
  }

  @Get('check-auth-status')
  @Auth(ValidRoles.user)
  @ApiQuery({
    name: 'token',
    required: true,
    type: String
  })
  checkAuthStatus(
    @GetUser() user: User
  ){
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
   @Req() request: Express.Request,
   @GetUser() user: User,
   @GetUser('email') userEmail: string,
   @RawHeaders() rawHeaders: string[],
   @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: `tas como loquita`,
      user,
      userEmail: userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('private2')
  @RoleProtected( ValidRoles.superUser, ValidRoles.user )
  @UseGuards( AuthGuard(), UserRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }

  }

  @Get('private3')
  @Auth(ValidRoles.user)
  testingPrivateRoute3(
    @GetUser() user: User,
  ){
    return {
      ok: true,
      user
    }

  }


}

