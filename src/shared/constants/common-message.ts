const CommonMessage = {
  USER_INACTIVE: 'کاربر غیرفعال می‌باشد.',
  INTERNAL_SERVER: 'مشکلی پیش آمد، لطفا دوباره تلاش کنید.',
  NOT_FOUND: 'مسیر پیدا نشد.',
  WORKSPACE_NOT_FOUND: 'میزکار یافت نشد.',
  AUTHENTICATION_REQUIRED: 'ابتدا وارد حساب کاربری خود شوید.',
  ACCESS_DENIED: 'دسترسی شما مجاز نمی‌باشد.',
  INVALID_FILE_TYPE: 'فرمت فایل ارسالی معتبر نمی‌باشد.',
  INVALID_FILE_SIZE: 'حجم فایل ارسالی بیش از حد مجاز است.',
  FILE_REQUIRED: 'فایلی برای آپلود کردن انتخاب نشده، لطفا فایلی انتخاب کنید.',
  TOO_MANY_REQUESTS: 'تعداد درخواست‌های شما بیش از حد مجاز است، لطفا :time ثانیه دیگر تلاش کنید.',
} as const;

export default CommonMessage;
