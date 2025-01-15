import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from 'libs/building-block/filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  // еnabling comprеssion, you can significantly rеducе the sizе of thе data sent to thе cliеnt
  app.use(compression());

  // add the security headers
  app.use(helmet());

  // TODO: Configure the cors with FE domain
  // enable Cors
  app.enableCors();

  // set global prefix
  app.setGlobalPrefix('api/v1');

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //Excpetion Filter
  app.useGlobalFilters(new CustomExceptionFilter());

  // swagger integration:
  const config = new DocumentBuilder()
    .setTitle('v2incentives - Backend')
    .setDescription('v2incentives admin panel')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const swaggerOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };

  SwaggerModule.setup('docs', app, document, swaggerOptions);

  // starting server
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3001;
  await app.listen(PORT, () => {
    Logger.log(` [ 🚀 ] - v2incentives server started at the port: ${PORT} `);
  });
}
bootstrap();
