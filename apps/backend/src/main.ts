import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getEnvConfig } from './shared/config/env-configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({ origin: '*' });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const mailConfig = getEnvConfig().mail;
  console.log('Mail config:', {
    user: mailConfig.user,
    passLength: mailConfig.password?.length || 0,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
