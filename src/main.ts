import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidateInputPipe({
        whitelist: true,
        skipMissingProperties: true,
        transform: true,
      }));
    await app.listen(parseInt(process.env.PORT));
    console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().finally(() => {
    console.info('Success');
  });



