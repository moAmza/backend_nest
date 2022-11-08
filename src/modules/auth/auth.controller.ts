import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { InConfirmDto } from './dtos/in-confirm.dto';
import { InLoginDto } from './dtos/in-login.dto';
import { InRegisterDto } from './dtos/in-register.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthService } from './auth.service';
import { OutShortVerifierDto } from './dtos/out-short-verifier.dto';
import { OutJwtTokenDto } from './dtos/out-jwt-token.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { DuplicateError } from '../../errors/duplicate-error';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';

@UseGuards(RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'send verification code' })
  @ApiBadRequestResponse({ type: DuplicateError })
  async register(
    @Body() userInfo: InRegisterDto,
  ): Promise<OutShortVerifierDto> {
    const data = await this.authService.register(userInfo);
    if (data instanceof DuplicateError) return data.throw();
    return data;
  }

  @Put('user')
  @ApiOperation({ summary: 'edit user' })
  @ApiBadRequestResponse({ type: DuplicateError })
  async editUser(
    @Body() userInfo: InRegisterDto,
  ): Promise<OutShortVerifierDto> {
    const data = await this.authService.register(userInfo);
    if (data instanceof DuplicateError) return data.throw();
    return data;
  }

  @Post('login')
  @ApiOperation({ summary: 'login user' })
  @ApiNotFoundResponse({ type: NotFoundError })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async login(@Body() userInfo: InLoginDto): Promise<OutJwtTokenDto> {
    const data = await this.authService.login(userInfo);
    if (data instanceof BadRequestError) return data.throw();
    if (data instanceof NotFoundError) return data.throw();
    return data;
  }

  @Post('confirmation')
  @ApiOperation({ summary: 'verify code and create new user' })
  @ApiBadRequestResponse({ type: BadRequestError })
  @ApiNotFoundResponse({ type: NotFoundError })
  async conformation(@Body() userInfo: InConfirmDto): Promise<OutJwtTokenDto> {
    const data = await this.authService.confirm(userInfo);
    if (data instanceof DuplicateError) return data.throw();
    if (data instanceof BadRequestError) return data.throw();
    if (data instanceof NotFoundError) return data.throw();
    return data;
  }
}
