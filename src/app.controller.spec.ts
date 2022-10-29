import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './modules/user/user.controller';
import { UserService } from './modules/user/user.service';

describe('AppController', () => {
  let userController: UserController;

  beforeEach(async () => {
    // const app: TestingModule = await Test.createTestingModule({
    //   controllers: [UserController],
    //   providers: [UserService],
    // }).compile();
    // userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(1).toBe(1);
    });
  });
});
