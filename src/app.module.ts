import { SharedModule } from "@modules/shared/shared.module";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { SentryInterceptor } from "@xiifain/nestjs-sentry";

import { ChatModule } from "./modules/chat/chat.module";

@Module({
	imports: [SharedModule, ChatModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useValue: new SentryInterceptor(),
		},
	],
})
export class AppModule {}
