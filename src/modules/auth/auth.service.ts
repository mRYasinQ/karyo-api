import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { EnvConfig } from '@/shared/schemas/env.schema';
import formatMessage from '@/shared/utils/format-message';
import { generateOtp } from '@/shared/utils/random';

import RedisService from '../redis/providers/redis.service';
import UserService from '../user/user.service';
import AuthMessage from './auth.message';
import type { Recover, Register, SendOtp, VerifyOtp } from './dtos/auth.dto';
import type { OtpPayload } from './interfaces/otp-payload.interface';

@Injectable()
class AuthService {
  private otpExpire: number;
  private otpCache: number;

  private readonly prefixRegister = 'register';
  private readonly prefixRecover = 'recover';

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {
    this.otpExpire = this.config.getOrThrow<EnvConfig['OTP_EXPIRE']>('time.otp.expire');
    this.otpCache = this.config.getOrThrow<EnvConfig['OTP_CACHE']>('time.otp.cache');
  }

  async register(data: Register) {
    const { email, password, otp } = data;

    const key = `${this.prefixRegister}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (!otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.redisService.delete(key);

    await this.userService.create({ email, password, isEmailVerified: true });

    return;
  }

  async sendRegisterOtp(data: SendOtp) {
    const { email } = data;

    const isUserExist = await this.userService.checkUserExistByEmail(email);
    if (isUserExist) throw new BadRequestException(AuthMessage.EMAIL_ALREADY_ASSOCIATED);

    const key = `${this.prefixRegister}:${email}`;

    const { value: otpResult, ttl } = await this.redisService.getWithTtl(key);
    if (otpResult && ttl && ttl > 0) {
      const { verified } = JSON.parse(otpResult) as OtpPayload;

      if (!verified) throw new HttpException(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }), HttpStatus.TOO_MANY_REQUESTS);
    }

    const otp = String(generateOtp());
    const payload: OtpPayload = { otp, verified: false };
    const value = JSON.stringify(payload);

    await this.redisService.set(key, value, this.otpExpire);

    return { email };
  }

  async verifyRegisterOtp(data: VerifyOtp) {
    const { email, otp } = data;

    const key = `${this.prefixRegister}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (otpData.verified) throw new BadRequestException(AuthMessage.OTP_ALREADY_VERIFIED);
    if (otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const payload: OtpPayload = { otp, verified: true };
    const value = JSON.stringify(payload);

    await this.redisService.set(key, value, this.otpCache);

    return { email, verified: true };
  }

  async recover(data: Recover) {
    const { email, password, otp } = data;

    const user = await this.userService.findOneByEmail(email, { fields: ['id'] });
    if (!user) throw new BadRequestException(AuthMessage.EMAIL_INCORRECT);

    const key = `${this.prefixRecover}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (!otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.redisService.delete(key);

    await this.userService.update(user.id, { password, isEmailVerified: true });

    return;
  }

  async sendRecoverOtp(data: SendOtp) {
    const { email } = data;

    const isUserExist = await this.userService.checkUserExistByEmail(email);
    if (!isUserExist) throw new BadRequestException(AuthMessage.EMAIL_INCORRECT);

    const key = `${this.prefixRecover}:${email}`;

    const { value: otpResult, ttl } = await this.redisService.getWithTtl(key);
    if (otpResult && ttl && ttl > 0) {
      const { verified } = JSON.parse(otpResult) as OtpPayload;

      if (!verified) throw new HttpException(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }), HttpStatus.TOO_MANY_REQUESTS);
    }

    const otp = String(generateOtp());
    const payload: OtpPayload = { otp, verified: false };
    const value = JSON.stringify(payload);

    await this.redisService.set(key, value, this.otpExpire);

    return { email };
  }

  async verifyRecoverOtp(data: VerifyOtp) {
    const { email, otp } = data;

    const key = `${this.prefixRecover}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (otpData.verified) throw new BadRequestException(AuthMessage.OTP_ALREADY_VERIFIED);
    if (otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const payload: OtpPayload = { otp, verified: true };
    const value = JSON.stringify(payload);

    await this.redisService.set(key, value, this.otpCache);

    return { email, verified: true };
  }
}

export default AuthService;
