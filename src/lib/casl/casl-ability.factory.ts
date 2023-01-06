import {
	AbilityBuilder,
	createMongoAbility,
	ExtractSubjectType,
	InferSubjects,
	MongoAbility,
} from "@casl/ability";
import { Roles } from "@common/types/enums/permission.enum";
import { Post, User } from "@entities";
import { Injectable } from "@nestjs/common";

export type Subjects = InferSubjects<typeof User | typeof Post> | "all";

export enum Action {
	Manage = "manage",
	Create = "create",
	Read = "read",
	Update = "update",
	Delete = "delete",
}

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
	createForUser(user: User) {
		const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

		if (user.roles.includes(Roles.ADMIN)) {
			can(Action.Manage, "all"); // read-write access to everything
		} else {
			can(Action.Read, "all"); // read-only access to everything
		}

		return build({
			detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
		});
	}
}
