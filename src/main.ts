import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fastifyStatic from '@fastify/static';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // CORS Configuration
  app.enableCors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  // Static Files Configuration
  app
    .getHttpAdapter()
    .getInstance()
    .register(fastifyStatic, {
      root: join(__dirname, '..', 'public'),
      prefix: '/public/',
    });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('PatChef')
    .setDescription('The PatChef API description')
    .setVersion('0.0.1')
    .build();

  // Swagger Document Build Setup
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory, {
    customSiteTitle: 'PatChef API',
    customfavIcon: './public/square-terminal.svg',
  });

  await app.listen({ port: 6970 });
}

bootstrap();
