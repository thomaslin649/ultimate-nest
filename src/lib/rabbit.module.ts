import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Global, Logger, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestConfigModule } from "@lib/config/config.module";

const logger = new Logger("RabbitMQ");

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [NestConfigModule],
      useFactory: (configService: ConfigService<Configs, true>) => ({
        exchanges: [
          {
            name: configService.get("rabbitmq.exchange", { infer: true }),
            type: "topic",
          },
        ],
        uri: configService.get("rabbitmq.url", { infer: true }),
        connectionInitOptions: { wait: true, reject: true, timeout: 3000 },
        logger,
        channels: {
          "channel-1": {
            prefetchCount: +configService.get("rabbitmq.prefetchCount", {
              infer: true,
            }),
            default: true,
          },
          "channel-2": {
            prefetchCount: 2,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RabbitMQModule],
})
export class NestRabbitModule {}
