import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UserSchema } from './modules/user/user.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const options = new DocumentBuilder()
    .setTitle('Fpl api doc')
    .setDescription('Nestjs sample project developed by moAmza.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // console.dir(options, { depth: null });
  UserSchema.index({ username: 'text', firstname: 'text', lastname: 'text' });

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
