import { InRegisterDto } from './in-register.dto';

export class TypeFullVerifier {
  id: string;
  code: number;
  count: number;
  email: string;
  userInfo: InRegisterDto;
  createdAt: Date;
  deletedAt?: Date;
}
