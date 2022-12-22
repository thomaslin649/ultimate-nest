import { join } from "node:path";

import { IsUniqueConstraint } from "@common/validators";
import {
	NestCacheModule,
	NestCaslModule,
	NestCloudinaryModule,
	NestConfigModule,
	NestI18nModule,
	NestMailModule,
	NestPinoModule,
	NestSentryModule,
	OrmModule,
} from "@lib/index";
import { AuthModule } from "@modules/auth/auth.module";
import { ChatModule } from "@modules/chat/chat.module";
import { HealthModule } from "@modules/health/health.module";
import { PostModule } from "@modules/post/post.module";
import { ProfileModule } from "@modules/profile/profile.module";
import { RabbitModule } from "@modules/rabbit/rabbit.module";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { UserModule } from "@modules/user/user.module";

@Module({
	imports: [
		AuthModule,
		PostModule,
		ProfileModule,
		HealthModule,
		NestConfigModule,
		UserModule,
		OrmModule,
		RabbitModule,
		NestMailModule,
		NestPinoModule,
		NestI18nModule,
		ChatModule,
		HttpModule.register({
			timeout: 5000,
			maxRedirects: 5,
			withCredentials: false,
		}),
		NestCacheModule,
		NestCloudinaryModule,
		NestSentryModule,
		NestCaslModule,
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "resources"),
			serveStaticOptions: {
				maxAge: 86_400, // 1 day
			},
		}),
	],
	providers: [IsUniqueConstraint],
})
export class SharedModule {}
