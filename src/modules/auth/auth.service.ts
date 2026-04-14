import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import CommonMessage from '@/shared/constants/common-message';
import type { UserAgentResult } from '@/shared/decorators/user-agent.decorator';
import type { EnvConfig } from '@/shared/schemas/env.schema';
import formatMessage from '@/shared/utils/format-message';
import { generateOtp, generateRandomBytes } from '@/shared/utils/random';

import PasswordProvider from '../common/providers/password.provider';
import MailService from '../mail/providers/mail.service';
import RedisService from '../redis/redis.service';
import SessionService from '../session/session.service';
import UserService from '../user/user.service';
import AuthMessage from './auth.message';
import type { Login, Recover, Register, SendOtp, VerifyEmailOtp, VerifyOtp } from './dtos/auth.dto';
import type { OtpPayload } from './interfaces/otp-payload.interface';

@Injectable()
class AuthService {
  private otpExpire: number;
  private otpCache: number;

  private readonly prefixRegister = 'register';
  private readonly prefixRecover = 'recover';
  private readonly prefixVerify = 'verify';

  constructor(
    private readonly config: ConfigService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
    private readonly passwordProvider: PasswordProvider,
    private readonly mailService: MailService,
  ) {
    this.otpExpire = this.config.getOrThrow<EnvConfig['OTP_EXPIRE']>('time.otp.expire');
    this.otpCache = this.config.getOrThrow<EnvConfig['OTP_CACHE']>('time.otp.cache');
  }

  async login(data: Login, agent: UserAgentResult) {
    const { email, password } = data;

    const user = await this.userService.findOneByEmail(email, { fields: ['id', 'password', 'isActive'] });
    if (!user) throw new BadRequestException(AuthMessage.CREDENTIALS_INCORRECT);

    const { password: hashedPassword, isActive } = user;

    const isPasswordValid = await this.passwordProvider.compare(password, hashedPassword);
    if (!isPasswordValid) throw new BadRequestException(AuthMessage.CREDENTIALS_INCORRECT);

    if (!isActive) throw new ForbiddenException(CommonMessage.USER_INACTIVE);

    const token = await this.createToken(user.id, agent);

    return { email, token };
  }

  async register(data: Register, agent: UserAgentResult) {
    const { email, password, otp } = data;

    const key = `${this.prefixRegister}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (!otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.redisService.delete(key);

    const user = await this.userService.create({ email, password, is_email_verified: true });
    await this.mailService.sendMail({
      jobName: 'welcome_mail',
      mail: email,
      title: 'به کاریو خوش آمدید.',
      message: 'کاربر عزیز ثبت‌نام شما با موفقیت انجام شد.',
    });

    const token = await this.createToken(user.id, agent);

    return { email, token };
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
    await this.mailService.sendMail({
      jobName: 'register_code_mail',
      mail: email,
      title: 'کد تایید ایمیل',
      message: `کد تایید ایمیل شما: ${otp}`,
    });

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

  async recover(data: Recover, agent: UserAgentResult) {
    const { email, password, otp } = data;

    const user = await this.userService.findOneByEmail(email, { fields: ['id'] });
    if (!user) throw new BadRequestException(AuthMessage.EMAIL_INCORRECT);

    const key = `${this.prefixRecover}:${email}`;

    const otpResult = await this.redisService.get(key);
    if (!otpResult) throw new BadRequestException(AuthMessage.INVALID_OTP);

    const otpData = JSON.parse(otpResult) as OtpPayload;
    if (!otpData.verified || otpData.otp !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.redisService.delete(key);

    await this.userService.update(user.id, { password, is_email_verified: true });

    const token = await this.createToken(user.id, agent);

    return { email, token };
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
    await this.mailService.sendMail({
      jobName: 'recover_password_mail',
      mail: email,
      title: 'کد بازیابی گذرواژه',
      message: `کد بازیابی شما: ${otp}`,
    });

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

  async sendVerifyEmailOtp(userId: number) {
    const user = await this.userService.findOneById(userId, { fields: ['email', 'isEmailVerified'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { email, isEmailVerified } = user;

    if (isEmailVerified) throw new BadRequestException(AuthMessage.EMAIL_VERIFIED);

    const key = `${this.prefixVerify}:${email}`;

    const { value: otpResult, ttl } = await this.redisService.getWithTtl(key);
    if (otpResult && ttl && ttl > 0) {
      throw new HttpException(formatMessage(AuthMessage.WAIT_BEFORE_NEW_OTP, { time: ttl }), HttpStatus.TOO_MANY_REQUESTS);
    }

    const otp = String(generateOtp());

    await this.redisService.set(key, otp, this.otpExpire);
    await this.mailService.sendMail({
      jobName: 'verify_email_mail',
      mail: email,
      title: 'کد تایید ایمیل',
      message: `کد تایید ایمیل شما: ${otp}`,
    });

    return { email };
  }

  async verifyEmail(userId: number, data: VerifyEmailOtp) {
    const user = await this.userService.findOneById(userId, { fields: ['email'] });
    if (!user) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    const { email } = user;
    const key = `${this.prefixVerify}:${email}`;

    const { otp } = data;
    const otpValue = await this.redisService.get(key);
    if (otpValue !== otp) throw new BadRequestException(AuthMessage.INVALID_OTP);

    await this.redisService.delete(key);

    await this.userService.update(userId, { is_email_verified: true });

    return { email, is_email_verified: true };
  }

  async logout(sessionId: number) {
    await this.sessionService.deleteById(sessionId);
    return;
  }

  async validateToken(token: string) {
    const session = await this.sessionService.findOneByToken(
      {
        token,
        expireAt: { $gt: new Date() },
      },
      {
        populate: ['user', 'user.role'],
        fields: ['user.id', 'user.role.permissions', '*'],
      },
    );
    if (!session) throw new UnauthorizedException(CommonMessage.AUTHENTICATION_REQUIRED);

    return session;
  }

  private async createToken(userId: number, agent: UserAgentResult) {
    const { browser, os } = agent;

    const token = generateRandomBytes();

    const tokenExpire = this.config.getOrThrow<EnvConfig['SESSION_EXPIRE']>('time.session.expire');
    const tokenExpireMs = Date.now() + tokenExpire;
    const expireAt = new Date(tokenExpireMs);

    await this.sessionService.create({ token, userId, browser, os, expireAt });

    return token;
  }
}

export default AuthService;
