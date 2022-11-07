import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test } from '@nestjs/testing';
import mongoose from 'mongoose';
import { join } from 'path';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UserModule } from '../src/modules/user/user.module';

const userInfo = {
  username: 'username',
  password: 'password',
  firstname: 'firstname',
  lastname: 'lastnamee',
  country: 'country',
  email: 'email@email.email',
  birthday: '2022-11-06T05:44:48.270Z',
};

describe('auth e2e tests', () => {
  let app: INestApplication;
  let req: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ServeStaticModule.forRoot({ rootPath: join(__dirname, 'public') }),
        MongooseModule.forRoot('mongodb://localhost/nest_test'),
        UserModule,
        AuthModule,
      ],
    }).compile();
    app = await moduleRef
      .createNestApplication()
      .useGlobalPipes(new ValidationPipe({ whitelist: true }))
      .init();
    req = request(app.getHttpServer());
  });

  afterEach(async () => {
    mongoose.connect('mongodb://localhost/nest_test');
    await mongoose.connection.useDb('nest_test').dropDatabase();
    await mongoose.connection.close();
    await app.close();
  });

  it('register and login user successfully', async () => {
    let registerRes = await req.post('/auth/signup').send(userInfo);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toEqual({ status: true, count: 0 });
    let confirmRes = await req.post('/auth/confirmation').send({
      email: 'email@email.email',
      code: 19283,
    });
    expect(confirmRes.status).toBe(201);
    expect(confirmRes.body.jwt).not.toBeNull();
    let loginRes = await req.post('/auth/login').send({
      username: 'username',
      password: 'password',
    });
    expect(loginRes.status).toBe(201);
  });

  it('wrong confirmation', async () => {
    let registerRes = await req.post('/auth/signup').send(userInfo);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toEqual({ status: true, count: 0 });
    for (let i = 0; i < 3; i++) {
      let confirmRes = await req.post('/auth/confirmation').send({
        email: 'email@email.email',
        code: 1010,
      });
      expect(confirmRes.status).toBe(400);
      expect(confirmRes.body.errorType).toBe('InvalidValidationCode');
    }
    let confirmRes = await req.post('/auth/confirmation').send({
      email: 'email@email.email',
      code: 1010,
    });
    expect(confirmRes.status).toBe(400);
    expect(confirmRes.body.errorType).toBe('ExpiredVerifier');
  });

  it('duplicate user info', async () => {
    let registerRes = await req.post('/auth/signup').send(userInfo);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toEqual({ status: true, count: 0 });
    registerRes = await req.post('/auth/signup').send(userInfo);
    expect(registerRes.status).toBe(201);
    expect(registerRes.body).toEqual({ status: true, count: 0 });
    let confirmRes = await req.post('/auth/confirmation').send({
      email: 'email@email.email',
      code: 19283,
    });
    expect(confirmRes.status).toBe(201);
    expect(confirmRes.body.jwt).not.toBeNull();
    registerRes = await req.post('/auth/signup').send(userInfo);
    expect(registerRes.status).toBe(400);
    expect(registerRes.body.errorType).toEqual('DuplicateError');
  });
});
