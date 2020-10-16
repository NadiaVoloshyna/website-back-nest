import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateInputPipe } from './core/pipes/validate.pipe';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // global endpoints prefix
    app.setGlobalPrefix('api/v1');
    // handle all user input validation globally
    app.useGlobalPipes(new ValidateInputPipe());
    await app.listen(3000);
    console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().finally(() => {
    console.info('Success');
  });



