import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import setupSwagger from './swagger';
import { AppUtils } from '@common/helpers/app.utils';
import helmet from 'helmet';
import * as compression from 'compression';
import {
	ExpressAdapter,
	NestExpressApplication,
} from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(
		AppModule,
		new ExpressAdapter(),
		{ bufferLogs: true },
	);

	AppUtils.killAppWithGrace(app);

	const configService = app.get(ConfigService);

	// ==================================================
	// configureExpressSettings
	// ==================================================

	app.enableCors();
	app.use(helmet());
	app.use(compression());

	// ==================================================
	// configureNestGlobals
	// ==================================================

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	).setGlobalPrefix('v1');

	// ==================================================
	// configureNestSwagger
	// ==================================================

	setupSwagger(app);

	// ==================================================
	// configurePinoLogger
	// ==================================================

	app.useLogger(app.get(Logger));

	const port = configService.get<number>('app.port', 3000);

	await app.listen(port);

	console.info('Bootstrap', `Server running on 🚀 ${await app.getUrl()}`);
}

(async () => await bootstrap())();
