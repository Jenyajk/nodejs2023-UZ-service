import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/create-user.dto';
import { Token } from './token';
import { ValidationPipe } from './pipe/validation.pipe';
import { Public } from './public.decorator';
@Public()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto): Promise<Token> {
    return await this.authService.signin(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body('refreshToken', new ValidationPipe()) refreshToken: string,
  ): Promise<Token> {
    return await this.authService.refresh(refreshToken);
  }
}
