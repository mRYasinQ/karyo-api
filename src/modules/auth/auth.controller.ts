import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import ApiStandard from '@/shared/decorators/api-standard.decorator';

import AuthMessage from './auth.message';
import AuthService from './auth.service';
import { RecoverDto, RegisterDto, SendOtpDto, VerifyOtpDto } from './dtos/auth.dto';
import { RecoverResponseDto, RegisterResponseDto, SendOtpResponseDto, VerifyOtpResponseDto } from './dtos/auth-response.dto';

@Controller('auth')
@ApiTags('Authentication')
class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiStandard({
    status: HttpStatus.CREATED,
    successMessage: AuthMessage.REGISTER_SUCCESS,
    summary: 'Register user',
    type: RegisterResponseDto,
  })
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('register/send-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.SENT_OTP,
    summary: 'Send otp to email',
    type: SendOtpResponseDto,
  })
  sendRegisterOtp(@Body() body: SendOtpDto) {
    return this.authService.sendRegisterOtp(body);
  }

  @Post('register/verify-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.VERIFIED_OTP,
    summary: 'Verify otp',
    type: VerifyOtpResponseDto,
  })
  verifyRegisterOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyRegisterOtp(body);
  }

  @Post('recover')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.RECOVER_SUCCESS,
    summary: 'Recover password',
    type: RecoverResponseDto,
  })
  recover(@Body() body: RecoverDto) {
    return this.authService.recover(body);
  }

  @Post('recover/send-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.SENT_OTP,
    summary: 'Send otp to email for recover password',
    type: SendOtpResponseDto,
  })
  sendRecoverOtp(@Body() body: SendOtpDto) {
    return this.authService.sendRecoverOtp(body);
  }

  @Post('recover/verify-otp')
  @ApiStandard({
    status: HttpStatus.OK,
    successMessage: AuthMessage.VERIFIED_OTP,
    summary: 'Verify otp for recover password',
    type: VerifyOtpResponseDto,
  })
  verifyRecoverOtp(@Body() body: VerifyOtpDto) {
    return this.authService.verifyRecoverOtp(body);
  }
}

export default AuthController;
