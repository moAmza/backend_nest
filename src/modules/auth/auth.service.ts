import { Injectable } from '@nestjs/common';
import { InConfirmDto } from './dtos/in-confirm.dto';
import { InLoginDto } from './dtos/in-login.dto';
import { InRegisterDto } from './dtos/in-register.dto';
import { VerifierRepo } from './verifier.repo';
import { UserService } from '../user/user.service';
import { OutShortVerifierDto } from './dtos/out-short-verifier.dto';
import { sign } from 'jsonwebtoken';
import { TypeJwtPayload } from './dtos/type-jwt-payload.dto';
import { VerifierDao } from './daos/verifer.dao';
import { TypeFullVerifier } from './dtos/type-full-verifier.dto';
import { OutJwtTokenDto } from './dtos/out-jwt-token.dto';
import { DuplicateError } from '../../errors/duplicate-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { NotFoundError } from '../../errors/not-found-error';
import { TeamService } from '../team/team.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly mailService: MailService,
    private readonly verifier: VerifierRepo,
  ) {}

  private verifiyVerifier(
    validator: TypeFullVerifier,
    code: number,
  ): true | BadRequestError {
    const minutesFromCreation =
      (Date.now() - validator.createdAt.getTime()) / (60 * 1000);

    if (validator.count > 2) return new BadRequestError('ExpiredVerifier');
    if (minutesFromCreation > 2) return new BadRequestError('ExpiredVerifier');
    if (code !== validator.code)
      return new BadRequestError('InvalidValidationCode');

    return true;
  }

  private generateJwt(user: TypeJwtPayload): string {
    return sign(user, 'secret');
  }

  async register(
    userInfo: InRegisterDto,
  ): Promise<OutShortVerifierDto | DuplicateError> {
    const code = 19283;
    const isInputValid = await this.userService.verifyRegisterInput(userInfo);

    if (isInputValid !== true) return isInputValid;
    const verifierModel = await this.verifier.create({
      code,
      count: 0,
      email: userInfo.email,
      userInfo: userInfo,
      createdAt: new Date(),
    });
    const verifier = VerifierDao.convertOne(verifierModel);
    const mail = this.mailService.sendVerifierEmail(verifier);
    return {
      status: true,
      count: verifier.count,
    };
  }

  async confirm({
    email,
    code,
  }: InConfirmDto): Promise<
    OutJwtTokenDto | BadRequestError | DuplicateError | NotFoundError
  > {
    const verifierModel = await this.verifier.getByEmail(email);
    if (!verifierModel) return new NotFoundError('User');
    const verifier = VerifierDao.convertOne(verifierModel);
    const isVerified = this.verifiyVerifier(verifier, code);
    if (isVerified !== true) return isVerified;
    const user = await this.userService.createUser(verifier.userInfo);
    if (user instanceof DuplicateError) return user;
    await this.teamService.createTeam(user.id, `${user.username}'s team`);
    if (user instanceof DuplicateError) return user;
    const token = this.generateJwt({
      role: 'USER',
      userId: user.id,
      username: user.username,
    });

    return { token };
  }

  async login({
    username,
    password,
  }: InLoginDto): Promise<OutJwtTokenDto | NotFoundError | BadRequestError> {
    const authInfo = await this.userService.getAuthInfoByUsername(username);
    if (authInfo instanceof NotFoundError) return authInfo;
    if (authInfo.password !== password)
      return new BadRequestError('InvalidPassword');
    const token = this.generateJwt({
      role: 'USER',
      userId: authInfo.id,
      username: authInfo.username,
    });

    return { token };
  }
}
