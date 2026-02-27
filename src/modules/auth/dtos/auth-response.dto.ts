import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { createBaseResponse, createDataResponse } from '@/shared/utils/create-response-dto';

import AuthMessage from '../auth.message';

class LoginData {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  token: string;
}

class SendOtpData {
  @ApiProperty({ format: 'email' })
  email: string;
}

class VerifyOtpData {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty({ example: true })
  verified: boolean;
}

class LoginResponseDto extends createDataResponse(LoginData, AuthMessage.LOGIN_SUCCESS) {}

class RegisterResponseDto extends createDataResponse(LoginData, AuthMessage.REGISTER_SUCCESS, HttpStatus.CREATED) {}
class RecoverResponseDto extends createDataResponse(LoginData, AuthMessage.RECOVER_SUCCESS) {}

class SendOtpResponseDto extends createDataResponse(SendOtpData, AuthMessage.SENT_OTP) {}
class VerifyOtpResponseDto extends createDataResponse(VerifyOtpData, AuthMessage.VERIFIED_OTP) {}

class LogoutResponseDto extends createBaseResponse(AuthMessage.LOGOUT_SUCCESS) {}

export { LoginResponseDto, RegisterResponseDto, RecoverResponseDto, SendOtpResponseDto, VerifyOtpResponseDto, LogoutResponseDto };
