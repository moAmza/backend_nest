import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VerifierRepo } from './verifier.repo';
import { Verifier, VerifierSchema } from './verifier.schema';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { TeamModule } from '../team/team.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verifier.name, schema: VerifierSchema },
    ]),
    UserModule,
    TeamModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, VerifierRepo],
  exports: [],
})
export class AuthModule {}
