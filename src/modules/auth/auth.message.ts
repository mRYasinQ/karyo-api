const AuthMessage = {
  LOGIN_SUCCESS: 'ورود با موفقیت انجام شد.',
  REGISTER_SUCCESS: 'ثبت‌نام با موفقیت انجام شد.',
  RECOVER_SUCCESS: 'بازنشانی گذرواژه با موفقیت انجام شد.',
  SENT_OTP: 'کد تایید ارسال شد.',
  VERIFIED_OTP: 'کد تایید شد.',
  OTP_ALREADY_VERIFIED: 'این کد قبلا تایید شده است.',
  EMAIL_ALREADY_ASSOCIATED: 'حسابی با این ایمیل ثبت شده است.',
  EMAIL_INCORRECT: 'ایمیل نادرست است.',
  CREDENTIALS_INCORRECT: 'ایمیل یا گذرواژه نادرست است.',
  INVALID_OTP: 'کد تایید معتبر نمی‌باشد.',
  WAIT_BEFORE_NEW_OTP: 'لطفا :time ثانیه دیگر دوباره تلاش کنید.',
} as const;

export default AuthMessage;
