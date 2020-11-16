import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { ValidationPipe, ValidationError, UnprocessableEntityException } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        const message = errors.map(
          error =>
            `${Object.values(error.constraints).join(', ')}`,
        );
        return new UnprocessableEntityException(message);
      },
        skipMissingProperties: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }));
    await app.listen(parseInt(process.env.PORT));
    console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().finally(() => {
    console.info('Success');
  });


  
      