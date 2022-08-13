import { User } from "../../../entities/user.entity";
import { Factory, Faker } from "@mikro-orm/seeder";
import { Roles } from "@common/types/enums/permission.enum";

/* `UserFactory` is a factory that creates `User` instances */
export class UserFactory extends Factory<User> {
	model = User;

	definition(faker: Faker): Partial<User> {
		return {
			firstName: faker.name.firstName(),
			lastName: faker.name.firstName(),
			username: faker.internet.userName(),
			avatar: faker.image.avatar(),
			email: faker.internet.email(),
			roles: [Roles.AUTHOR],
			password: process.env.USER_PASSWORD,
		};
	}
}
