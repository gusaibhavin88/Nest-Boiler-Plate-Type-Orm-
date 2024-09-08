import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('BOILER TEMPLATE DOCUMENTATION')
    .setDescription('Swagger documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const theme = new SwaggerTheme();
  const options = {
    explorer: false,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  };

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
};
