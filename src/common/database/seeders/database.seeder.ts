import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { AdminSeeder } from "./admin.seeder";
import { UserSeeder } from "./user.seeder";

/* It calls the AdminSeeder and UserSeeder classes */
export class DatabaseSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		return this.call(em, [AdminSeeder, UserSeeder]);
	}
}
