const WorkspaceMessage = {
  WORKSPACES_GET: 'میزکارها دریافت شدند.',
  WORKSPACE_GET: 'میزکار دریافت شد.',
  WORKSPACE_CREATED: 'میزکار ایجاد شد.',
  WORKSPACE_UPDATED: 'میزکار بروزرسانی شد.',
  WORKSPACE_DELETED: 'میزکار حذف شد.',
  INVITATIONS_GET: 'دعوتنامه‌های شما دریافت شدند.',
  INVITE_SENT: 'در صورت وجود داشتن کاربر با ایمیل وارد شده، دعوتنامه ارسال خواهد شد.',
  INVITE_RESPONSE_SENT: 'پاسخ دعوتنامه با موفقیت ارسال شد.',
  SLUG_EXIST: 'شناسه کوتاه میزکار از قبل وجود دارد.',
  ALREADY_MEMBER: 'کاربر از قبل عضو میزکار می‌باشد.',
  INVITE_NOT_FOUND: 'دعوتنامه‌ای یافت نشد.',
} as const;

export default WorkspaceMessage;
