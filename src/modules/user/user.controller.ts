import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Param,
	Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto, EditUserDto, UserRegistrationDto } from "./dtos";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RolesBuilder, InjectRolesBuilder } from "nest-access-control";
import { User as UserEntity } from "@entities";
import { Auth } from "@common/decorators/auth.decorator";
import { LoggedInUser } from "@common/decorators/user.decorator";
import { AppResource, AppRoles } from "@common/constants/app.roles";
import { omit } from "@rubiin/js-utils";
import { I18n, I18nContext } from "nestjs-i18n";

@ApiTags("Users routes")
@Controller("user")
export class UserController {
	constructor(
		private readonly userService: UserService,
		@InjectRolesBuilder()
		private readonly rolesBuilder: RolesBuilder,
	) {}

	@Get()
	async getMany() {
		const data = await this.userService.getMany();

		return { data };
	}

	@ApiOperation({ summary: "public registration" })
	@Post("register")
	async publicRegistration(
		@Body() dto: UserRegistrationDto,
		@I18n() i18n: I18nContext,
	) {
		const data = await this.userService.createOne({
			...dto,
			roles: [AppRoles.AUTHOR],
		});

		return { message: i18n.t("operations.USER_REGISTERED"), data };
	}

	@Get(":id")
	async getOne(@Param("id") id: number) {
		const data = await this.userService.getOne(id);

		return { data };
	}

	@ApiOperation({ summary: "Admin create user" })
	@Auth({
		possession: "any",
		action: "create",
		resource: AppResource.USER,
	})
	@Post()
	async createOne(@Body() dto: CreateUserDto, @I18n() i18n: I18nContext) {
		const data = await this.userService.createOne(dto);

		return { message: i18n.t("operations.USER_CREATED"), data };
	}

	@Auth({
		possession: "own",
		action: "update",
		resource: AppResource.USER,
	})
	@Put(":id")
	async editOne(
		@Param("id") id: number,
		@Body() dto: EditUserDto,
		@LoggedInUser() user: UserEntity,
		@I18n() i18n: I18nContext,
	) {
		let data: any;

		if (
			this.rolesBuilder.can(user.roles).updateAny(AppResource.USER)
				.granted
		) {
			data = await this.userService.editOne(id, dto);
		} else {
			const rest = omit(dto, ["roles"]);

			data = await this.userService.editOne(id, rest, user);
		}

		return { message: i18n.t("operations.USER_EDITED"), data };
	}

	@Auth({
		action: "delete",
		possession: "own",
		resource: AppResource.USER,
	})
	@Delete(":id")
	async deleteOne(
		@Param("id") id: number,
		@LoggedInUser() user: UserEntity,
		@I18n() i18n: I18nContext,
	) {
		const data = await (this.rolesBuilder
			.can(user.roles)
			.updateAny(AppResource.USER).granted
			? this.userService.deleteOne(id)
			: this.userService.deleteOne(id, user));

		return { message: i18n.t("operations.USER_DELETED"), data };
	}
}
