import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('ClientGateway');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter());

  // Configuración para el documento OpenAPI
  const swaggerDocConfig = new DocumentBuilder()
    .setTitle('Client Gateway API')
    .setDescription('Documentación de la API del Client Gateway')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Generacion de documento OpenAPI
  const document = SwaggerModule.createDocument(app, swaggerDocConfig, {
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
    autoTagControllers: true
  });

  // Publicación de Swagger UI
  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    customSiteTitle: 'Client Gateway API',
    swaggerOptions: {
      persistAuthorization: true
    }
  })
  await app.listen(envs.port);
  logger.log(`Client Gateway is running on port ${envs.port}`);
}
bootstrap();
