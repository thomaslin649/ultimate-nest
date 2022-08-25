import { Auth, LoggedInUser, SwaggerDecorator } from "@common/decorators";
import { JwtAuthGuard } from "@common/guards/jwt.guard";
import { LoginType } from "@common/types/enums/misc.enum";
import { IOauthResponse } from "@common/types/interfaces";
import { User } from "@entities";
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
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { map, Observable } from "rxjs";
import { AuthService } from "./auth.service";
import {
	ChangePasswordDto,
	OtpVerifyDto,
	RefreshTokenDto,
	ResetPasswordDto,
	SendOtpDto,
	UserLoginDto,
} from "./dtos";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly tokenService: TokensService,
	) {}

	@Post("login")
	@ApiOperation({ summary: "User Login" })
	@ApiResponse({
		status: 403,
		description: "You account has not been activated yet!",
	})
	@ApiResponse({
		status: 400,
		description: "User name and password provided does not match.",
	})
	login(@Body() _loginDto: UserLoginDto) {
		return this.authService.login(_loginDto, LoginType.PASSWORD);
	}

	@Post("reset-password")
	@SwaggerDecorator({
		operation: "Reset password",
		notFound: "Otp doesn't exist.",
		badRequest: "Otp is expired.",
	})
	resetUserPassword(@Body() dto: ResetPasswordDto) {
		return this.authService.resetPassword(dto);
	}

	@Put("forgot-password")
	@Auth()
	@SwaggerDecorator({
		operation: "Forgot password",
		notFound: "Account doesn't exist.",
	})
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
		user: IOauthResponse,
		@Res() response: Response,
	) {
		return this.authService.login({ email: user.email }, LoginType.GOOGLE).pipe(
			map(data => {
				// client url
				return response.redirect(
					`${process.env.API_URL}/v1/auth/oauth/login?token=${data.payload.access_token}`,
				);
			}),
		);
	}

	@Get("facebook")
	@UseGuards(AuthGuard("facebook"))
	facebookAuth(@Req() _request: Request) {
		// the facebook auth redirect will be handled by passport
	}

	@Get("facebook/redirect")
	@UseGuards(AuthGuard("facebook"))
	facebookAuthRedirect(
		@LoggedInUser()
		user: IOauthResponse,
		@Res() response: Response,
	) {
		return this.authService.login({ email: user.email }, LoginType.FACEBOOK).pipe(
			map(data => {
				// client url
				return response.redirect(
					`${process.env.API_URL}/v1/auth/oauth/login?token=${data.payload.access_token}`,
				);
			}),
		);
	}

	// this simulates a frontend url for testing oauth login
	@Get("oauth/login")
	oauthMock(@Query() query: { token: string }) {
		return { message: "successfully logged", token: query.token };
	}

	@Post("verify-otp")
	@SwaggerDecorator({
		operation: "Verify otp",
		notFound: "Otp doesn't exist.",
		badRequest: "Otp is expired.",
	})
	async verifyOtp(@Body() dto: OtpVerifyDto) {
		return this.authService.verifyOtp(dto);
	}

	@Post("change-password")
	@Auth()
	@SwaggerDecorator({
		operation: "Change password",
		badRequest: "Username and password provided does not match.",
	})
	changePassword(@Body() dto: ChangePasswordDto, @LoggedInUser() user: User) {
		return this.authService.changePassword(dto, user);
	}

	@ApiOperation({ summary: "Refresh token" })
	@Post("token/refresh")
	public async refresh(@Body() body: RefreshTokenDto): Promise<any> {
		const { token } = await this.tokenService.createAccessTokenFromRefreshToken(
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
