import { AppResource } from "@common/constants/app.roles";
import { LoginType } from "@common/constants/misc.enum";
import { Auth } from "@common/decorators/auth.decorator";
import { LoggedInUser } from "@common/decorators/user.decorator";
import { JwtAuthGuard } from "@common/guards/jwt.guard";
import { User, User as UserEntity } from "@entities";
import { TokensService } from "@modules/token/tokens.service";
import {
	Body,
	Controller,
	Get,
	ParseBoolPipe,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { OtpVerifyDto, SendOtpDto } from "./dtos/otp.dto";
import { RefreshTokenDto } from "./dtos/refresh-request.dto";
import { ChangePasswordDto, ResetPasswordDto } from "./dtos/reset-password";
import { UserLoginDto } from "./dtos/user-login";

@ApiTags("Auth routes")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokensService,
	) {}

	@ApiOperation({ summary: "Login" })
	@Post("login")
	@ApiBody({ type: UserLoginDto })
	login(@Body() _loginDto: UserLoginDto) {
		return this.authService.login(_loginDto, LoginType.PASSWORD);
	}

	@ApiOperation({ summary: "Reset password" })
	@Post("reset-password")
	resetUserPassword(@Body() dto: ResetPasswordDto) {
		return this.authService.resetPassword(dto);
	}

	@ApiOperation({ summary: "Forgot password" })
	@Put("forgot-password")
	async forgotPassword(@Body() dto: SendOtpDto) {
		return this.authService.forgotPassword(dto);
	}

	@Get("google")
	@UseGuards(AuthGuard("google"))
	googleAuth(@Req() _request: Request) {
		// the google auth redirect will be handled by passport
	}

	@Get("google/redirect")
	@UseGuards(AuthGuard("google"))
	googleAuthRedirect(
		@LoggedInUser()
		user: Pick<UserEntity, "firstName" | "lastName" | "email" | "avatar">,
	) {
		return this.authService.login({ email: user.email }, LoginType.GOOGLE);
	}

	@ApiOperation({ summary: "Verify otp" })
	@Post("verify-otp")
	async verifyOtp(@Body() dto: OtpVerifyDto) {
		return this.authService.verifyOtp(dto);
	}

	@ApiOperation({ summary: "Change password" })
	@Auth({
		action: "update",
		possession: "own",
		resource: AppResource.USER,
	})
	@Post("change-password")
	changePassword(
		@Body() dto: ChangePasswordDto,
		@LoggedInUser() user: UserEntity,
	) {
		return this.authService.changePassword(dto, user);
	}

	@ApiOperation({ summary: "Refresh token" })
	@Post("token/refresh")
	public async refresh(@Body() body: RefreshTokenDto): Promise<any> {
		const { token } =
			await this.tokenService.createAccessTokenFromRefreshToken(
				body.refreshToken,
			);

		return token;
	}

	@ApiOperation({ summary: "Logout user" })
	@UseGuards(JwtAuthGuard)
	@Post("logout")
	logout(
		@LoggedInUser() user: User,
		@Body() refreshToken?: RefreshTokenDto,
		@Query("from_all", ParseBoolPipe) fromAll = false,
	): Observable<any> {
		return fromAll
			? this.authService.logoutFromAll(user)
			: this.authService.logout(user, refreshToken.refreshToken);
	}
}
