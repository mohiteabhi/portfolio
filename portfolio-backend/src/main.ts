import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Portfolio AI')
    .setDescription('Backend APIs for Portfolio RAG Assistant')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT || 3000}`,
  );

  console.log(
    `📘 Swagger: http://localhost:${process.env.PORT || 3000}/swagger`,
  );
}
bootstrap();
