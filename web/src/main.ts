import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Profile } from './common/enums/profile.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Wanlilu')
    .setDescription('The Wanlilu API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  if (process.env.NODE_ENV !== Profile.PROD) {
    SwaggerModule.setup('api', app, document);
  }
  await app.listen(3000);
}
bootstrap();
