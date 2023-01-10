import { PageOptionsDto } from "@common/classes/pagination";
import {
	ApiFile,
	ApiPaginatedResponse,
	GenericController,
	Public,
	SwaggerResponse,
	UUIDParam,
} from "@common/decorators";
import { fileValidatorPipe } from "@common/misc";
import { IFile } from "@common/types";
import { Roles } from "@common/types/enums";
import { User } from "@entities";
import { Action, CheckPolicies, GenericPolicyHandler } from "@lib/casl";
import { Pagination } from "@lib/pagination";
import { Body, Delete, Get, Post, Put, Query, UploadedFile } from "@nestjs/common";
import { Observable } from "rxjs";

import { CreateUserDto, EditUserDto, UserRegistrationDto } from "./dtos";
import { UserService } from "./user.service";

@GenericController("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiPaginatedResponse(User, "Users list")
	@Get()
	getMany(@Query() pageOptionsDto: PageOptionsDto): Observable<Pagination<User>> {
		return this.userService.findAll(pageOptionsDto);
	}

	@Public()
	@Post("register")
	@SwaggerResponse({
		operation: "Create user",
		badRequest: "User already registered with email.",
	})
	@ApiFile("avatar")
	async publicRegistration(
		@Body() dto: UserRegistrationDto,
		@UploadedFile(fileValidatorPipe({}))
		image: IFile,
	) {
		return this.userService.create({
			...dto,
			roles: [Roles.AUTHOR],
			image,
		});
	}

	@Get(":idx")
	@SwaggerResponse({
		operation: "User fetch",
		notFound: "User does not exist.",
		params: ["idx"],
	})
	@CheckPolicies(new GenericPolicyHandler(User, Action.Read))
	getOne(@UUIDParam("idx") index: string): Observable<User> {
		return this.userService.findOne(index);
	}

	@Post()
	@SwaggerResponse({
		operation: "User fetch",
		badRequest: "User already registered with email.",
	})
	@CheckPolicies(new GenericPolicyHandler(User, Action.Create))
	@ApiFile("avatar")
	async createOne(
		@Body() dto: CreateUserDto,
		@UploadedFile(fileValidatorPipe({}))
		image: IFile,
	) {
		return this.userService.create({ ...dto, image });
	}

	@Put(":idx")
	@SwaggerResponse({
		operation: "User fetch",
		badRequest: "User already registered with email.",
		notFound: "User does not exist.",
		params: ["idx"],
	})
	@CheckPolicies(new GenericPolicyHandler(User, Action.Update))
	editOne(@UUIDParam("idx") index: string, @Body() dto: EditUserDto): Observable<User> {
		return this.userService.update(index, dto);
	}

	@Delete(":idx")
	@SwaggerResponse({
		operation: "User fetch",
		notFound: "User does not exist.",
		params: ["idx"],
	})
	@CheckPolicies(new GenericPolicyHandler(User, Action.Delete))
	deleteOne(@UUIDParam("idx") index: string): Observable<User> {
		return this.userService.remove(index);
	}
}
