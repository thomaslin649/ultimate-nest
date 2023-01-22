import { INestApplicationContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { Server, ServerOptions } from "socket.io";

export class SocketIOAdapter extends IoAdapter {
	private readonly logger = new Logger(SocketIOAdapter.name);
	private adapterConstructor: ReturnType<typeof createAdapter>;

	constructor(private app: INestApplicationContext, private readonly config: ConfigService) {
		super(app);
	}

	async connectToRedis(): Promise<void> {
		const pubClient = createClient({ url: this.config.get<string>("redis.uri") });
		const subClient = pubClient.duplicate();

		await Promise.all([pubClient.connect(), subClient.connect()]);

		this.adapterConstructor = createAdapter(pubClient, subClient);
	}

	createIOServer(port: number, options?: ServerOptions) {
		const clientUrl = this.config.get("app.clientUrl");

		const cors = {
			origin: [clientUrl],
		};

		const optionsWithCORS: ServerOptions = {
			...options,
			cors,
		};

		const server: Server = super.createIOServer(port, optionsWithCORS);

		server.adapter(this.adapterConstructor);

		return server;
	}
}
