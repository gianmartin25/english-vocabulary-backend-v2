import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginTicket, OAuth2Client } from 'google-auth-library';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const exists = await this.usersService.findByEmail(createUserDto.email);
    if (exists) {
      throw new BadRequestException('El email ya está registrado');
    }
    const user = await this.usersService.create(createUserDto);
    const payload = { sub: user.id, email: user.email };
    const access_token: string = this.authService.generateToken(payload);
    return {
      access_token,
      user: { ...user, password: undefined },
    };
  }

  @Post('google-mobile')
  async googleMobile(@Body('idToken') idToken: string) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket: LoginTicket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      throw new UnauthorizedException('Token de Google inválido');
    }
    const payload = ticket.getPayload();
    if (!payload) throw new UnauthorizedException('Token de Google inválido');

    let user = await this.usersService.findByEmail(payload.email ?? '');
    if (!user) {
      user = await this.usersService.create({
        name: payload?.given_name ?? '',
        lastname: payload.family_name ?? '',
        email: payload.email ?? '',
        password: '', // Puedes dejarlo vacío o un valor por defecto
        englishLevel: '',
        learningGoals: '',
        profileImage: payload.picture ?? '',
      });
    }

    const appToken = this.authService.generateToken({
      sub: user.id,
      email: user.email,
    });
    return { access_token: appToken, user: { ...user, password: undefined } };
  }
}
