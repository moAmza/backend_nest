import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './confings/swagger-config';
import { UserSchema } from './modules/user/user.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  configSwagger(app);

  UserSchema.index({ username: 'text', firstname: 'text', lastname: 'text' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
