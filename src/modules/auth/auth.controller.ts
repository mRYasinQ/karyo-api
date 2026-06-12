import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiTooManyRequestsResponse } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';
import CurrentUser from '@/shared/decorators/current-user.decorator';
import UserAgent, { type UserAgentResult } from '@/shared/decorators/user-agent.decorator';

import type { Session } from '@/shared/types/global';

import AuthMessage from './auth.message';
import AuthService from './auth.service';
import { LoginDto, RecoverDto, RegisterDto, SendOtpDto, VerifyEmailOtpDto, VerifyOtpDto } from './dtos/auth.dto';
import {
  LoginResponseDto,
  LogoutResponseDto,
  RecoverResponseDto,
  RegisterResponseDto,
  SendOtpResponseDto,
  TooManyRequestOtpResponseDto,
  VerifyEmailOtpResponseDto,
  VerifyOtpResponseDto,
} from './dtos/auth-response.dto';

@Controller('auth')
@ApiTags('Authentication')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.LOGIN_SUCCESS,
    summary: 'Login a user',
    type: LoginResponseDto,
  })
  login(@Body() body: LoginDto, @UserAgent() agent: UserAgentResult) {
    return this.authService.login(body, agent);
  }

  @Post('register')
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: AuthMessage.REGISTER_SUCCESS,
    summary: 'Register a new user',
    type: RegisterResponseDto,
  })
  register(@Body() body: RegisterDto, @UserAgent() agent: UserAgentResult) {
    return this.authService.register(body, agent);
  }

  @Post('register/send-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.SENT_OTP,
    summary: 'Send OTP to email',
    type: SendOtpResponseDto,
  })
  @ApiTooManyRequestsResponse({ type: TooManyRequestOtpResponseDto })
  sendRegisterOtp(@Body() body: SendOtpDto) {
    return this.authService.sendRegisterOtp(body);
  }

  @Post('register/verify-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.VERIFIED_OTP,
    summary: 'Verify OTP',
    type: VerifyOtpResponseDto,
  })
  verifyRegisterOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyRegisterOtp(body);
  }

  @Post('recover')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.RECOVER_SUCCESS,
    summary: 'Recover a user password',
    type: RecoverResponseDto,
  })
  recover(@Body() body: RecoverDto, @UserAgent() agent: UserAgentResult) {
    return this.authService.recover(body, agent);
  }

  @Post('recover/send-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.SENT_OTP,
    summary: 'Send OTP to email',
    type: SendOtpResponseDto,
  })
  @ApiTooManyRequestsResponse({ type: TooManyRequestOtpResponseDto })
  sendRecoverOtp(@Body() body: SendOtpDto) {
    return this.authService.sendRecoverOtp(body);
  }

  @Post('recover/verify-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.VERIFIED_OTP,
    summary: 'Verify OTP',
    type: VerifyOtpResponseDto,
  })
  verifyRecoverOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyRecoverOtp(body);
  }

  @Post('verify-email/send-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.SENT_OTP,
    summary: 'Send OTP to email',
    type: SendOtpResponseDto,
    secure: 'required',
  })
  @ApiTooManyRequestsResponse({ type: TooManyRequestOtpResponseDto })
  sendVerifyEmailOtp(@CurrentUser('id') userId: number) {
    return this.authService.sendVerifyEmailOtp(userId);
  }

  @Post('verify-email/verify-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.EMAIL_VERIFIED_SUCCESS,
    summary: 'Verify OTP',
    type: VerifyEmailOtpResponseDto,
    secure: 'required',
  })
  verifyEmail(@Body() body: VerifyEmailOtpDto, @CurrentUser('id') userId: number) {
    return this.authService.verifyEmail(userId, body);
  }

  @Post('logout')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.LOGOUT_SUCCESS,
    summary: 'Logout a user',
    type: LogoutResponseDto,
    secure: 'required',
  })
  logout(@CurrentUser('session') currentSession: Session) {
    return this.authService.logout(currentSession.id);
  }
}

export default AuthController;
