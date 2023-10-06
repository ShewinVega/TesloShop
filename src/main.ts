import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix roots
  app.setGlobalPrefix('/api');


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger initial configuration
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API ')
    .setDescription('Teslo API to save products and users auth management')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api',app, document);

  await app.listen(3000);
}
bootstrap();
